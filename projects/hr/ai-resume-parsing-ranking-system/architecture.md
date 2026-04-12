### 1. System Overview

Applications create **candidate records** and store raw files in **object storage**. **Ingest workflow** runs OCR/extraction to **structured_profile JSON**. **Scoring service** computes rubric match vector deterministically or via ML head. **Explainer agent** (optional) narrates matches using **field references**. **Review UI** gates stage transitions.

---

### 2. Architecture Diagram (text-based)

```
Application submit
        ↓
   Ingest workflow
   ↓      ↓       ↓
 store  OCR   extract→validate
        ↓
   Ranker (rules + model)
        ↓
   Explainer agent (optional)
        ↓
   Recruiter review → ATS sync
```

---

### 3. Core Components

- **UI / API Layer:** Candidate profile, rubric coverage heatmap, audit trail.
- **LLM layer:** Extraction + explanation with strict schemas.
- **Agents (if any):** Single agent session per candidate review assist.
- **Tools / Integrations:** ATS APIs, calendar, email templates (non-automated reject where restricted).
- **Memory / RAG:** Job description + rubric retrieval; approved taxonomy docs.
- **Data sources:** Resumes, application answers, referrer notes.

---

### 4. Data Flow

1. **Input:** Upload resume; parse MIME; virus scan; enqueue extraction.
2. **Processing:** Produce structured profile; validate required fields; dedupe against existing profiles.
3. **Tool usage:** Map skills via ontology tool; compute scores; generate explain JSON tied to `field_id`.
4. **Output:** Persist ranking; notify recruiter; await human decision for stage advance.

---

### 5. Agent Interaction (if applicable)

Single assistive agent. **Ranker** remains auditable code/model; agent does not silently change numeric weights.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; worker pool for OCR/LLM; per-tenant queues for noisy spikes.
- **Caching:** Ontology snapshots; embedding caches for job reqs (versioned).
- **Async processing:** Extraction always async; UI polls job status.

---

### 7. Failure Handling

- **Retries:** OCR/LLM retries with caps; human queue on repeated failure.
- **Fallbacks:** Manual data entry path; disable auto-ranking flag per req.
- **Validation:** Reject profiles missing visa/work authorization fields if legally required in your product region.

---

### 8. Observability

- **Logging:** Stage timings, extraction confidence, score version, human override codes.
- **Tracing:** Trace `application_id` through pipeline with PII controls.
- **Metrics:** Time-to-first review, offer rate by source (watch for bias), extraction error rate, cost per candidate.
