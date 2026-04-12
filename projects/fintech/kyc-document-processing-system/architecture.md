### 1. System Overview

Uploads land in **object storage** with encryption. A **workflow** orchestrates **virus scan → OCR → field extraction → validations → vendor checks → decision**. Results persist in **Postgres** with encrypted fields. **Reviewer UI** pulls cases from queues by risk score.

---

### 2. Architecture Diagram (text-based)

```
Client upload (presigned URL)
        ↓
   KYC workflow (Temporal/Inngest)
        ↓
   OCR / doc AI → structured fields
        ↓
   Validators (regex, checksum, cross-field)
        ↓
   Vendor checks (watchlist, doc auth, face match)
        ↓
   Decision + audit → core platform
```

---

### 3. Core Components

- **UI / API Layer:** Capture SDK, status polling, reviewer console.
- **LLM layer:** Optional field normalization with hard validation afterward.
- **Agents (if any):** None required in core.
- **Tools / Integrations:** Bureau APIs, sanctions lists, email/SMS for step-up.
- **Memory / RAG:** Case notes; policy snippets for reviewers.
- **Data sources:** User uploads, external verification responses.

---

### 4. Data Flow

1. **Input:** Client uploads front/back/selfie per jurisdiction requirements.
2. **Processing:** OCR extracts fields; validators compute pass/partial/fail codes.
3. **Tool usage:** Call vendor services with minimal necessary images; redact outputs for logs.
4. **Output:** Emit webhook to account service; route to manual queue with structured failure reasons.

---

### 5. Agent Interaction (if applicable)

Optional **reviewer copilot** reads structured JSON only; never sends raw images to general models unless vendor contract allows.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; worker pool scales with queue depth; shard reviewers by locale expertise.
- **Caching:** Template libraries per document type version.
- **Async processing:** All heavy steps async; user sees progress states.

---

### 7. Failure Handling

- **Retries:** Vendor retries with jitter; DLQ for stuck cases with paging alerts.
- **Fallbacks:** Manual-only path if automation unhealthy (feature flag).
- **Validation:** Reject uploads over size limits or wrong MIME; malware quarantine.

---

### 8. Observability

- **Logging:** Stage timings, vendor error codes, decision codes (no raw PII).
- **Tracing:** Trace `case_id` through pipeline with strict redaction policies.
- **Metrics:** Straight-through processing rate, manual queue depth, OCR confidence, fraud catch rate (labeled sets), vendor latency.
