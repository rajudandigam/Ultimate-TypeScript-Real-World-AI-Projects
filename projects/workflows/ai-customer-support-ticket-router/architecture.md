### 1. System Overview

Tickets arrive via **webhooks** into an **ingress service** that writes canonical rows. **Feature extractor** computes text + metadata + account signals. **Router workflow** runs **rules layer** then **model layer** producing `RoutingDecision`. **Effect applier** updates CRM via **outbox** for reliability. **Feedback loop** stores human overrides.

---

### 2. Architecture Diagram (text-based)

```
Ticketing webhook
        ↓
   Ticket store (Postgres)
        ↓
   Feature extractor
        ↓
   Router workflow (rules → model)
        ↓
   Outbox → CRM field updates
        ↓
   Analytics + training export
```

---

### 3. Core Components

- **UI / API Layer:** Override console, policy editor, shadow vs live toggles.
- **LLM layer:** Optional classifier/explainer producing structured JSON only.
- **Agents (if any):** Not required on hot path.
- **Tools / Integrations:** Zendesk/JSM/Intercom APIs, Slack, PagerDuty.
- **Memory / RAG:** Optional similar-ticket retrieval for assistive suggestions.
- **Data sources:** Tickets, customer tier data, incident status feeds.

---

### 4. Data Flow

1. **Input:** Receive create/update event; normalize to internal ticket model.
2. **Processing:** Extract features; evaluate ordered rules; if needed call model with bounded text.
3. **Tool usage:** Apply queue/priority/tags through CRM adapter with idempotency keys.
4. **Output:** Emit metrics event; if human overrides, store label for training pipeline.

---

### 5. Agent Interaction (if applicable)

Optional offline **copilot** for analysts—not part of automated routing loop by default.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition webhook consumers; scale feature workers; read-heavy caches for org configs.
- **Caching:** Embeddings for static KB slices; per-tenant routing config snapshots.
- **Async processing:** Bulk reprocessing when taxonomy changes (versioned jobs).

---

### 7. Failure Handling

- **Retries:** Outbox retries for CRM 429/5xx; circuit breaker per integration.
- **Fallbacks:** Default queue + page oncall if automation unhealthy.
- **Validation:** Reject unknown queue ids; clamp priorities to allowed enums.

---

### 8. Observability

- **Logging:** Decision codes, rule hit path, model version, apply success/fail.
- **Tracing:** Trace `ticket_id` through pipeline with redaction.
- **Metrics:** Misroute proxy (override rate), time-to-route, queue depth, provider error taxonomy, drift monitors.
