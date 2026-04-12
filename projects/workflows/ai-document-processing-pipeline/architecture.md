### 1. System Overview

Documents enter **object storage** with tenant metadata. **Workflow engine** orchestrates **scan → classify → extract → validate → export**. Low-confidence rows go to **review queue**. **Outbox** delivers to downstream systems with retries. **Lineage store** tracks template version and model version per job.

---

### 2. Architecture Diagram (text-based)

```
Upload / poll / email ingest
        ↓
   Doc processing workflow
   ↓     ↓      ↓      ↓
virus  OCR  extract validate
        ↓
   Review queue (optional)
        ↓
   Export worker (outbox)
```

---

### 3. Core Components

- **UI / API Layer:** Upload UI, job status, reviewer console, template admin.
- **LLM layer:** Optional extraction/classification nodes with JSON schema outputs.
- **Agents (if any):** None required; optional offline Q&A over extracted tables.
- **Tools / Integrations:** OCR vendors, ERP APIs, data warehouse loaders.
- **Memory / RAG:** Approved few-shot libraries per doc type.
- **Data sources:** Customer PDFs, scans, bundled templates.

---

### 4. Data Flow

1. **Input:** Accept file; compute hash; short-circuit if already processed version exists.
2. **Processing:** Run OCR/layout; classify doc type; select template pipeline branch.
3. **Tool usage:** LLM/ML nodes produce structured JSON; validators enforce business rules.
4. **Output:** Write to staging tables; upon approval, publish to destination with receipt.

---

### 5. Agent Interaction (if applicable)

Not core. If added, a **review copilot** only suggests fixes using structured diff tools.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by tenant; autoscale OCR/LLM workers independently.
- **Caching:** Hash-based memoization of extraction outputs per `(file_hash, template_version)`.
- **Async processing:** All heavy steps async; API returns job id immediately.

---

### 7. Failure Handling

- **Retries:** Stage-level retries with caps; DLQ with replay tooling for ops.
- **Fallbacks:** Human-only path if automation unhealthy (feature flag).
- **Validation:** Hard fail export if totals mismatch or required fields null.

---

### 8. Observability

- **Logging:** Stage durations, confidence stats, export outcomes (metadata).
- **Tracing:** Trace `job_id` across workflow activities.
- **Metrics:** Throughput pages/hour, error rate by vendor, human touch time, cost per document.
