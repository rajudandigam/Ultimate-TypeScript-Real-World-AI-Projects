### 1. System Overview

Receipts arrive via **upload API** or **email poller** into **object storage**. A **workflow** stages: **virus scan → OCR → line extraction → categorization → policy checks → approval routing → export**. **Outbox** ensures ERP delivery is reliable. **Audit service** records field-level edits.

---

### 2. Architecture Diagram (text-based)

```
Ingest (email/mobile/card)
        ↓
   Expense workflow
        ↓
   OCR + parsers → line items (Postgres)
        ↓
   Rules + optional LLM tie-break
        ↓
   Approvals (manager chain)
        ↓
   ERP export worker (outbox)
```

---

### 3. Core Components

- **UI / API Layer:** Employee submit UI, approver inbox, finance admin.
- **LLM layer:** Optional classification assist with confidence scores.
- **Agents (if any):** None required in core L2.
- **Tools / Integrations:** ERP, HR org, payments/cards, email.
- **Memory / RAG:** Org merchant dictionary; optional policy FAQ retrieval.
- **Data sources:** Receipts, card feeds, mileage entries.

---

### 4. Data Flow

1. **Input:** Create report shell; attach receipts; ingest card txns for matching window.
2. **Processing:** OCR produces line items; rules assign GL; flags exceptions.
3. **Tool usage:** Notify approvers; on approval, enqueue export job with idempotency key.
4. **Output:** Post journal entries; archive report PDF; notify employee of payment schedule.

---

### 5. Agent Interaction (if applicable)

Not applicable for core pipeline. Optional separate **employee Q&A** bot reads policy KB only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; worker autoscaling by queue depth; shard by `org_id`.
- **Caching:** Merchant classification cache per org with admin invalidation.
- **Async processing:** OCR and export always async; user sees progress states.

---

### 7. Failure Handling

- **Retries:** OCR and ERP retries with exponential backoff; DLQ with replay tools.
- **Fallbacks:** Manual line entry path if OCR repeatedly fails.
- **Validation:** Totals must match within tolerance; block submit until resolved or waived with reason.

---

### 8. Observability

- **Logging:** Stage timings, OCR vendor errors, export outcomes, approval latencies.
- **Tracing:** Trace `report_id` through workflow (PII redacted spans).
- **Metrics:** Auto-categorization rate, human correction rate, close time, export failure rate, duplicate receipt hits.
