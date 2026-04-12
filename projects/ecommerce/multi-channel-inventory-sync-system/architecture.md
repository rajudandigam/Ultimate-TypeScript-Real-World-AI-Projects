### 1. System Overview

**Webhook gateway** authenticates sources and writes **canonical events** to a **ledger**. **Reconciliation workflow** computes desired channel states, emits **update intents**, and waits for **acknowledgements** or compensates on failure. **Shadow state** per channel tracks last known remote quantity.

---

### 2. Architecture Diagram (text-based)

```
Sources → ingest → canonical ledger
        ↓
Reconcile workflow → channel update intents
        ↓
Channel adapters → ack/nack → compensate if needed
```

---

### 3. Core Components

- **UI / API Layer:** Mapping admin, replay tools, dry-run previews.
- **LLM layer:** Optional ops summaries only.
- **Agents (if any):** None in v1.
- **Tools / Integrations:** Marketplace APIs, WMS, OMS, alerting.
- **Memory / RAG:** Ledger DB; optional vector index for internal runbooks.
- **Data sources:** Webhooks, polling jobs, CSV backfills.

---

### 4. Data Flow

1. **Input:** `sku_id` quantity change event with provenance.
2. **Processing:** Merge into ledger; detect conflicts via ruleset version.
3. **Tool usage:** Push updates per channel with idempotency keys; record responses.
4. **Output:** Consistent remote states or explicit human tasks on deadlock.

---

### 5. Agent Interaction (if applicable)

Not applicable for core sync path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by merchant; shard ledger hot keys.
- **Caching:** Read models for dashboards; invalidate on ledger append.
- **Async processing:** Bulk catch-up jobs after outages with checkpoints.

---

### 7. Failure Handling

- **Retries:** Per-channel policies; poison messages to DLQ with actionable diagnostics.
- **Fallbacks:** Read-only mode during incidents; pause destructive pushes.
- **Validation:** Block negative stock unless business rule explicitly allows backorder semantics.

---

### 8. Observability

- **Logging:** Structured channel API responses (redact secrets).
- **Tracing:** Trace reconcile waves across adapters.
- **Metrics:** Drift amount, success latency, 429 counts, oversell guard trips.
