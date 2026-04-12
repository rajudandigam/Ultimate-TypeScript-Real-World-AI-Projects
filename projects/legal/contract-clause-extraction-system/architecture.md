### 1. System Overview

**Upload gateway** virus-scans and stores **originals** in object storage. **OCR/layout workflow** produces **reading order text** with coordinates. **Extractor** runs rules + models to emit **clause candidates**. **QC workflow** routes low-confidence items to reviewers. **Publisher** writes canonical records and updates search indices.

---

### 2. Architecture Diagram (text-based)

```
Documents → OCR/layout → clause candidates
        ↓
QC UI / auto-accept (high confidence)
        ↓
Canonical clause DB → search / APIs
```

---

### 3. Core Components

- **UI / API Layer:** QC station, ontology editor, redaction tools.
- **LLM layer:** Optional span labeler with bounding box citations.
- **Agents (if any):** Optional later; not required for v1 correctness path.
- **Tools / Integrations:** CLM/DMS webhooks, e-sign completion events.
- **Memory / RAG:** Taxonomy docs; few-shot libraries per customer template family.
- **Data sources:** PDF/DOCX contracts, order forms, DPAs.

---

### 4. Data Flow

1. **Input:** `document_id` lands with tenant + privilege tags.
2. **Processing:** Parse pages; run classifiers; assemble structured JSON per schema.
3. **Tool usage:** Cross-check party names against CRM record if allowed.
4. **Output:** Upsert clauses; emit `document.parsed` event for downstream systems.

---

### 5. Agent Interaction (if applicable)

Optional copilot for reviewers; publishing remains explicit save action.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Worker pools per stage; GPU OCR pools optional.
- **Caching:** Reuse OCR for unchanged pages via content hashes.
- **Async processing:** Large deals split into page-range jobs with checkpoints.

---

### 7. Failure Handling

- **Retries:** Transient OCR failures per page range.
- **Fallbacks:** Mark document `needs_manual` with reason codes.
- **Validation:** JSON schema validation; reject impossible date ranges.

---

### 8. Observability

- **Logging:** Stage timings, confidence buckets, QC throughput.
- **Tracing:** Upload→publish latency per document.
- **Metrics:** Auto-accept rate, attorney override rate, defect escapes post-publish.
