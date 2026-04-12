### 1. System Overview

**Event ingestor** writes normalized **ticket events** to an append log. **SLA engine** materializes **per-ticket timers** with pause/resume transitions driven by field changes. **Escalation workflow** notifies channels when thresholds approach or breach. **Reporting** aggregates by account and tier.

---

### 2. Architecture Diagram (text-based)

```
Helpdesk webhooks → event log → SLA workflows
        ↓
State store (Postgres) → alerts / dashboards
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor, holiday calendar admin, breach inbox.
- **LLM layer:** Optional narrative summaries only.
- **Agents (if any):** None in core engine.
- **Tools / Integrations:** Helpdesk REST, Slack, email, PagerDuty.
- **Memory / RAG:** Policy version store; optional contract doc retrieval for staff.
- **Data sources:** Tickets, entitlements, business hours tables.

---

### 4. Data Flow

1. **Input:** `ticket.updated` with field diff; map to SLA-relevant transitions.
2. **Processing:** Recompute deadlines; detect near-breach windows.
3. **Tool usage:** Post internal notes or tags via API when configured.
4. **Output:** Emit notifications and update analytics warehouse.

---

### 5. Agent Interaction (if applicable)

Not applicable for clock correctness path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition event processing by shard key (brand_id).
- **Caching:** Business hours materialized per timezone for fast deadline math.
- **Async processing:** Nightly reconciliation job to fix drift vs vendor-native SLA.

---

### 7. Failure Handling

- **Retries:** At-least-once ingestion with idempotency keys `(ticket_id, event_seq)`.
- **Fallbacks:** If notification channel fails, route to alternate channel per policy.
- **Validation:** Reject policy deploy if simulation suite fails on historical fixtures.

---

### 8. Observability

- **Logging:** Timer transitions with policy version id.
- **Tracing:** Webhook→state update→notification spans.
- **Metrics:** Breach rate, MTTA/MTTR proxies, false escalation counts, replay depth.
