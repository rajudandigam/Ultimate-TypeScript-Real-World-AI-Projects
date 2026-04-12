### 1. System Overview

**Webhook ingress** normalizes channel payloads to a **canonical ticket model**. **Routing Agent** executes tools to gather **customer context** and **KB matches**, then outputs a **structured route**. **Policy service** approves auto-apply; else queues for human triage.

---

### 2. Architecture Diagram (text-based)

```
Channels → normalizer → ticket store
        ↓
Routing Agent → CRM/KB tools
        ↓
Route decision → helpdesk API update
```

---

### 3. Core Components

- **UI / API Layer:** Triage console, calibration dashboards, policy editor.
- **LLM layer:** Tool-using agent with confidence scores.
- **Agents (if any):** Single agent per ticket (stateless) recommended.
- **Tools / Integrations:** Helpdesk REST, CRM, payments (read-only), search.
- **Memory / RAG:** Curated KB index; not raw internet.
- **Data sources:** Tickets, macros, product catalog snippets.

---

### 4. Data Flow

1. **Input:** `ticket.created` event with redacted payload for model.
2. **Processing:** Link customer; fetch open/pending siblings; classify intent.
3. **Tool usage:** Score candidate queues; check VIP and SLA timers.
4. **Output:** Apply fields or attach internal recommendation note.

---

### 5. Agent Interaction (if applicable)

Single agent; human agent remains accountable for customer-facing replies.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by brand_id; async for bulk imports.
- **Caching:** KB retrieval cache per doc version.
- **Async processing:** Heavy CRM joins deferred without blocking webhook ack.

---

### 7. Failure Handling

- **Retries:** Vendor backoff; DLQ with replay after fix.
- **Fallbacks:** Default queue + `needs_review` tag on uncertainty.
- **Validation:** JSON schema for decisions; deny unknown queue ids.

---

### 8. Observability

- **Logging:** Decision codes, confidence buckets, override reasons.
- **Tracing:** Webhook→route span against first-response SLO.
- **Metrics:** Route accuracy from QA sampling, FRT, escalation rate, cost per ticket.
