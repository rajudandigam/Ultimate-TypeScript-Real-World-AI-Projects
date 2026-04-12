### 1. System Overview

The engine combines a **streaming/batch ingestion workflow** (OTLP, proxies, invoices) with a **metrics warehouse** for rollups. An **investigation agent** is invoked only from alerts or UI sessions, with tools to query pre-aggregated tables and deployment metadata—never raw unbounded log grep as the default.

---

### 2. Architecture Diagram (text-based)

```
App / Gateway (instrumented)
        ↓ OTLP
   Collector → Queue → Ingest workers
        ↓
   Warehouse (ClickHouse / BQ)
        ↓
   Scheduled rollup jobs (Temporal)
        ↓
   Anomaly detector (rules + stats + optional ML)
        ↓
   Alert router → Slack / PagerDuty
        ↓ (on demand)
   Investigation Agent → SQL / metadata tools → Draft mitigation
        ↓
   Human approval → Policy actions (throttle, kill switch)
```

---

### 3. Core Components

- **UI / API Layer:** Budget admin UI, drill-down explorer, alert acknowledgement APIs.
- **LLM layer:** Investigation agent with capped iterations; separate summarization for exec digests.
- **Agents (if any):** One primary investigation agent; optional policy agent for separation of duties.
- **Tools / Integrations:** Warehouse query, feature flags, deploy systems, ticketing, chat notifications.
- **Memory / RAG:** Optional retrieval of past incident writeups; versioned runbooks.
- **Data sources:** OpenTelemetry spans, provider usage APIs, tagged release events, billing CSVs.

---

### 4. Data Flow

1. **Input:** Spans arrive with `tenant_id`, `route`, `model`, token counts; validate and enrich with deployment version.
2. **Processing:** Stream into raw tables; periodic merge to hourly/daily aggregates keyed by dimensions you care about.
3. **Tool usage:** On anomaly, agent queries top dimensions, compares to baseline window, fetches correlated deploy.
4. **Output:** Structured incident doc with queries embedded; optional automated ticket; optional policy action after approval.

---

### 5. Agent Interaction (if multi-agent)

Default is **workflow + single investigation agent**. Multi-agent is justified when **automated remediation** requires a separate policy reviewer with no shared tool permissions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingest by tenant; separate query nodes from ingest paths.
- **Caching:** Materialized views for hot dashboards; precomputed top-N spenders per hour.
- **Async processing:** All rollups and anomaly scans async; interactive queries isolated to read replicas.

---

### 7. Failure Handling

- **Retries:** Ingest retries with dead-letter for poison messages; checkpointed backfills.
- **Fallbacks:** If agent unavailable, still fire numeric alert with top SQL pre-attached from detector.
- **Validation:** Reject spans missing required attribution fields; quarantine unknown models.

---

### 8. Observability

- **Logging:** Pipeline lag monitors, dedupe stats, schema violation counts.
- **Tracing:** Trace the telemetry pipeline itself; dogfood your own product on the agent’s LLM calls.
- **Metrics:** Cardinality caps, cost of the monitoring stack, alert precision tracking over time.
