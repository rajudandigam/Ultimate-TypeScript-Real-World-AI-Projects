### 1. System Overview

Authorization events publish to a **stream**. **Consumer workers** enrich with account and device context, compute **features**, evaluate **rules + model score**, and emit a **decision event** back to the auth platform. **Workflow** (or internal state machine) handles **step-up** timers and **case creation** on escalations.

---

### 2. Architecture Diagram (text-based)

```
Auth / core payments events → Kafka
        ↓
   Fraud consumer workers (scale-out)
        ↓
   Feature enricher (Redis + internal APIs)
        ↓
   Rules + model scorer
        ↓
   Decision emit (approve/challenge/decline)
        ↓
   Case store (Postgres) + optional analyst UI
```

---

### 3. Core Components

- **UI / API Layer:** Rule editor, simulation, investigator views.
- **LLM layer:** Optional offline only at L2 baseline.
- **Agents (if any):** None in core hot path.
- **Tools / Integrations:** Step-up providers, lists, device reputation feeds.
- **Memory / RAG:** Velocity windows; short TTL caches.
- **Data sources:** Transaction stream, account attributes, merchant category codes.

---

### 4. Data Flow

1. **Input:** Normalize event schema; reject malformed payloads.
2. **Processing:** Join features; compute score; evaluate ordered rules with explicit precedence.
3. **Tool usage:** Invoke step-up or list updates only on branch paths (async where possible).
4. **Output:** Return decision within SLA; async write case artifacts for review.

---

### 5. Agent Interaction (if applicable)

Not applicable for L2 core. Future analyst agent reads **structured case JSON** only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition consumers by `account_id` hash for ordered processing per account.
- **Caching:** Hot merchant and account risk caches with TTL and stampede protection.
- **Async processing:** Heavy graph features off hot path into parallel topic with delayed decisions if product allows.

---

### 7. Failure Handling

- **Retries:** At-least-once processing with dedupe store; poison messages to DLQ.
- **Fallbacks:** Safe default decision policy when enrichment unavailable (documented risk).
- **Validation:** Schema gates; maximum feature fan-out per event.

---

### 8. Observability

- **Logging:** Decision codes, rule hit paths, model version, latency breakdowns (no PAN).
- **Tracing:** Trace `transaction_id` through enrichment and scoring (sampling).
- **Metrics:** Approval rates, challenge rates, FP proxies, consumer lag, DLQ depth, shadow/live divergence.
