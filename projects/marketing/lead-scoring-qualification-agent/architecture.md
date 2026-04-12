### 1. System Overview

**Event pipeline** materializes **lead feature snapshots** in a warehouse. **Scoring Agent** reads via **parameterized tools** and emits **structured scores**. **Policy gateway** applies auto-write rules or routes to **human review**. **Audit store** keeps immutable history per `lead_id`.

---

### 2. Architecture Diagram (text-based)

```
CRM/events → feature ETL → snapshot tables
        ↓
Lead Scoring Agent → CRM / review queue
        ↓
Audit log + downstream sequences
```

---

### 3. Core Components

- **UI / API Layer:** Score debugger, weight editor, batch job console.
- **LLM layer:** Tool-using agent with schema-validated outputs.
- **Agents (if any):** Single agent per scoring invocation.
- **Tools / Integrations:** CRM APIs, warehouse queries, enrichment vendors.
- **Memory / RAG:** ICP and playbook retrieval; override training tables.
- **Data sources:** Forms, web analytics, product telemetry, email metrics.

---

### 4. Data Flow

1. **Input:** Trigger on lead update or scheduled batch partition.
2. **Processing:** Fetch snapshot row; attach consent flags and segment id.
3. **Tool usage:** Optionally pull extra firmographics; compute score + drivers.
4. **Output:** Persist score version; enqueue sales task or CRM field patch.

---

### 5. Agent Interaction (if applicable)

Single agent; destructive CRM actions behind explicit policy flags.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition batch scoring by shard; async workers.
- **Caching:** Hot lead snapshots in Redis with TTL tied to ETL freshness.
- **Async processing:** Nightly full re-score for model version bumps.

---

### 7. Failure Handling

- **Retries:** CRM API backoff; never double-post—use idempotency keys.
- **Fallbacks:** Degrade to rules-only score if LLM unavailable.
- **Validation:** Clamp scores; reject outputs missing required driver citations when policy demands.

---

### 8. Observability

- **Logging:** Score version, tool latencies, block reasons (consent, missing data).
- **Tracing:** Lead update → score → CRM spans.
- **Metrics:** Conversion lift experiments, override rate, cost per scored lead.
