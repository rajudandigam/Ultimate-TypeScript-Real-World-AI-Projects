### 1. System Overview

Ingestion and classification run as a **batch workflow** with deterministic stages. A **classification agent** handles only rows that fail rules or fall below confidence thresholds. A separate **insights job** summarizes aggregates and flags anomalies using the same evidence tables—no ad hoc spreadsheet exports as the source of truth.

---

### 2. Architecture Diagram (text-based)

```
Card / bank feed / receipt OCR
        ↓
   Ingest workflow (validate, normalize)
        ↓
   Rules engine + merchant dictionary
        ↓ (low confidence)
   Classification Agent + policy RAG
        ↓
   Human review queue (optional)
        ↓
   Accounting export adapter (idempotent)
        ↓
   Insights agent (scheduled) → email / UI digest
```

---

### 3. Core Components

- **UI / API Layer:** Employee submission UI, accountant review console, webhook ingestion.
- **LLM layer:** Structured classification; insight narratives from SQL summaries + retrieved policy clauses.
- **Agents (if any):** One classification agent path; optional insights agent with read-only tools.
- **Tools / Integrations:** Merchant enrichment, FX, accounting APIs, internal budget APIs.
- **Memory / RAG:** Policy document index versioned per tenant; correction history as structured features.
- **Data sources:** Transactions, receipts, chart of accounts, department metadata.

---

### 4. Data Flow

1. **Input:** Normalize each transaction to a canonical schema; compute `ingest_id`.
2. **Processing:** Rules assign labels or mark `needs_model`; attach user/org context features.
3. **Tool usage:** Agent fetches policy snippets and similar past transactions; returns structured label + citations.
4. **Output:** Persist proposed posting; route to export or review; insights job reads aggregates only.

---

### 5. Agent Interaction (if multi-agent)

Not required initially. If added, keep **one writer** to the ledger proposal table; other roles are read-only advisors.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workflows by tenant and month; autoscale workers on queue depth.
- **Caching:** Cache merchant metadata; cache policy embeddings by `(doc_version, chunk_id)`.
- **Async processing:** Month-end as chunked parallel jobs with checkpoints.

---

### 7. Failure Handling

- **Retries:** Transient API errors with backoff; poison messages to DLQ with reason codes.
- **Fallbacks:** If agent unavailable, escalate to human queue with rule-based best guess flagged.
- **Validation:** Chart-of-accounts foreign keys, currency checks, duplicate transaction detection.

---

### 8. Observability

- **Logging:** Per-row decision lineage without logging full PAN; tokenize sensitive fields.
- **Tracing:** Trace ingest → classify → export as one chain per batch id.
- **Metrics:** Auto-accept rate, human override rate, export success latency, anomaly precision.
