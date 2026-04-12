### 1. System Overview

The platform uses **OTLP collectors** feeding **stream processors** that normalize attributes, apply **PII scrubbers**, and write to **columnar/trace stores**. **Rollup jobs** compute cost and latency aggregates per `(tenant, route, model, prompt_version)`. Query APIs serve UIs and alerts.

---

### 2. Architecture Diagram (text-based)

```
Services (OTel SDK)
        ↓ OTLP
   Collectors / gateway
        ↓
   Stream processor (enrich + scrub + sample)
        ↓
   Hot store (e.g., ClickHouse) + trace backend
        ↓
   Rollup / budget jobs (scheduled)
        ↓
   Grafana / internal UI + alerting
```

---

### 3. Core Components

- **UI / API Layer:** Explorer UI, admin for schema registry and sampling policies.
- **LLM layer:** Offline summarization workers only.
- **Agents (if any):** None in core pipeline.
- **Tools / Integrations:** Alerting, ticketing, billing correlation jobs.
- **Memory / RAG:** Optional retrieval of incident notes keyed by `service`—not on ingest path.
- **Data sources:** OTLP logs/traces/metrics, cloud cost exports.

---

### 4. Data Flow

1. **Input:** Receive OTLP batch; authenticate tenant; validate size/cardinality limits.
2. **Processing:** Map attributes to canonical keys; scrub secrets; apply sampling; write rows.
3. **Tool usage:** N/A on hot path; scheduled jobs call billing APIs for reconciliation.
4. **Output:** Serve queries; fire alerts when SLO burn or budget thresholds crossed.

---

### 5. Agent Interaction (if applicable)

Not applicable for core ingest. Downstream copilots may read this store via **read-only APIs**.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingest by tenant hash; autoscale processors; separate OLAP query clusters.
- **Caching:** Metadata caches for team ownership maps; precomputed rollups for dashboards.
- **Async processing:** Heavy rollups and exports as batch jobs.

---

### 7. Failure Handling

- **Retries:** Collector retries to services; disk spill to handle bursts.
- **Fallbacks:** Drop low-priority spans under pressure with explicit counters (never silent without metric).
- **Validation:** Reject unknown tenant; quarantine payloads failing schema validation.

---

### 8. Observability

- **Logging:** Collector health, drop reasons, scrubber hit rates.
- **Tracing:** Meta-tracing for collector pipeline itself (dogfooding).
- **Metrics:** Ingest lag, cardinality top-N, cost reconciliation error rate.
