### 1. System Overview

Clients send **expense events** to an API persisted in **Postgres**. **OCR workers** enrich photos asynchronously. A **budget engine** recomputes pacing and thresholds on each insert. The **budget agent** answers chat queries via **read tools** and proposes **category fixes** via validated write tools. **Push service** sends nudges based on rules.

---

### 2. Architecture Diagram (text-based)

```
Mobile / web
        ↓
   Trip API → ledger (Postgres)
        ↓
   OCR worker (async) → suggested rows
        ↓
   Budget Agent (tools: list, update, summarize)
        ↓
   Notifications (rules + optional LLM copy)
```

---

### 3. Core Components

- **UI / API Layer:** Trip dashboard, receipt inbox, confirmation for OCR suggestions.
- **LLM layer:** Categorization + coaching phrasing agent.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** FX rate provider, push notifications, optional bank feed.
- **Memory / RAG:** User defaults; optional small destination cost KB.
- **Data sources:** User-entered data, card feeds, OCR pipeline.

---

### 4. Data Flow

1. **Input:** User adds expense or uploads receipt; server stores pending row.
2. **Processing:** OCR completes; agent proposes category; user confirms or edits.
3. **Tool usage:** Agent reads aggregates by day/category; may call `reclassify_expense` with enum only.
4. **Output:** Update rollups; enqueue notification if pacing rule fires.

---

### 5. Agent Interaction (if applicable)

Single agent. Rules engine owns **when** to notify; LLM only drafts message body within templates.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; workers scale with OCR queue depth.
- **Caching:** FX rates with TTL; trip summary snapshots for fast reads.
- **Async processing:** OCR and bank reconciliation off hot path.

---

### 7. Failure Handling

- **Retries:** Webhook and OCR retries with DLQ for poison files.
- **Fallbacks:** If LLM down, show numeric dashboard only with templated tips.
- **Validation:** Reject expenses with impossible timestamps or currencies unsupported by product.

---

### 8. Observability

- **Logging:** OCR latency, categorization overrides, notification sends.
- **Tracing:** Trace `trip_id` operations across API and workers.
- **Metrics:** Active trips, spend velocity vs plan, user correction rate, sync health.
