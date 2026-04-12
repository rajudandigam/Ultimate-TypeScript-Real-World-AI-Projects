### 1. System Overview

**Submission ingestor** stores essays with **integrity hashes**. **Parser** produces paragraph index. **Grading Agent** returns **structured scorecard** referencing **span ids**. **Post-processor** applies **calibration** and **policy checks**. **LMS adapter** writes grades or marks as **pending review** per configuration.

---

### 2. Architecture Diagram (text-based)

```
LMS / upload → ingest → parse/index
        ↓
Grading Agent → scorecard JSON → validation
        ↓
LMS gradebook / instructor review queue
```

---

### 3. Core Components

- **UI / API Layer:** Instructor calibration, appeal handler, audit export.
- **LLM layer:** Tool-using or single-pass structured grading with span refs.
- **Agents (if any):** Single agent per submission; dual-agent optional for high stakes.
- **Tools / Integrations:** LMS APIs, OCR pipeline, similarity vendor (optional).
- **Memory / RAG:** Rubric + exemplar retrieval (licensed, scoped).
- **Data sources:** Assignment prompts, prior anonymized anchor papers.

---

### 4. Data Flow

1. **Input:** Authenticate student/instructor context; fetch rubric version.
2. **Processing:** Parse doc; optionally run integrity checks per institution policy.
3. **Tool usage:** Score each rubric dimension with evidence spans; assemble feedback blocks.
4. **Output:** Persist results; if auto-post disabled, notify instructor for approval.

---

### 5. Agent Interaction (if applicable)

Single agent; human appeal updates gold labels for calibration loop (governed).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch workers for large exams; isolate per-tenant queues.
- **Caching:** Parsed paragraph index keyed by content hash.
- **Async processing:** OCR and long essays off interactive path.

---

### 7. Failure Handling

- **Retries:** Transient model errors with bounded replays; variance triggers human review flag.
- **Fallbacks:** If parsing fails, route to manual grading with student notice.
- **Validation:** Schema validation; clamp scores to rubric ranges; detect missing dimensions.

---

### 8. Observability

- **Logging:** Rubric version, latency, refusal reasons, redaction stats.
- **Tracing:** Upload→grade spans per submission.
- **Metrics:** Human override rate, reliability coefficients, cost per 1k words.
