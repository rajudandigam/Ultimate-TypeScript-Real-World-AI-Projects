### 1. System Overview

Invoices flow through a **pipeline** of discrete workers: ingest artifact to object storage, run OCR/layout analysis, **extract** structured fields via model+rules hybrid, **classify** to GL, run **validators** (math, duplicates, PO match), then enqueue ERP posts via an **outbox** for reliability.

---

### 2. Architecture Diagram (text-based)

```
Invoice intake (email / SFTP / API)
        ↓
   Object storage (immutable originals)
        ↓
   Workflow: OCR / layout
        ↓
   Extraction (LLM + schema) + rules
        ↓
   Classification + PO match tools
        ↓
   Validator (deterministic)
        ↓
   Exception queue OR ERP outbox post
```

---

### 3. Core Components

- **UI / API Layer:** AP review console, supplier status portal (optional), admin rules editor.
- **LLM layer:** Structured extraction prompts; optional vision path for complex PDFs.
- **Agents (if any):** Optional analyst assistant for exceptions—not autopost authority.
- **Tools / Integrations:** ERP APIs, vendor DB, FX, sanctions screening, email receipt parsers.
- **Memory / RAG:** Retrieval of similar invoices and correction notes (tenant-scoped).
- **Data sources:** PDFs, XML/UBL, email MIME, EDI files.

---

### 4. Data Flow

1. **Input:** Store raw file; compute `document_hash`; reject duplicates early.
2. **Processing:** Extract header/lines/taxes; normalize currency; classify to GL with confidence.
3. **Tool usage:** Query PO lines; validate vendor bank details against golden record; post draft to ERP when checks pass.
4. **Output:** Persist `posting_id` or route to exceptions with structured reasons for humans.

---

### 5. Agent Interaction (if applicable)

Workflow-only for money movement. Any “agent” is confined to **exception explanation** and suggested corrections as drafts.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by tenant; isolate OCR-heavy nodes.
- **Caching:** Cache vendor layout fingerprints; reuse extraction hints for recurring suppliers.
- **Async processing:** Large batches with checkpoints; prioritize by due date and amount.

---

### 7. Failure Handling

- **Retries:** Transient OCR/LLM/ERP errors with capped attempts; DLQ for manual classification.
- **Fallbacks:** Human-only path always available; never lose original artifact reference.
- **Validation:** Hard-stop on arithmetic mismatch; block autopost on any sanctions hit.

---

### 8. Observability

- **Logging:** Stage timings, validator codes, model versions; minimize PAN/account numbers in logs.
- **Tracing:** Trace each invoice `id` through all stages with baggage for tenant.
- **Metrics:** Straight-through processing rate, exception rate by reason, ERP error codes, cost per invoice.
