### 1. System Overview

**Ingest webhook** accepts applications into **object storage** + metadata row. **Parse workflow** extracts structured fields. **Score workflow** applies **rubric vN** and writes **rank artifacts**. **ATS sync workflow** moves candidates to review stages per policy.

---

### 2. Architecture Diagram (text-based)

```
Apply → store file → parse → feature row
        ↓
Score + explain → ranked queue → recruiter UI
        ↘ optional LLM normalize (validated)
```

---

### 3. Core Components

- **UI / API Layer:** Ranked inbox, override reasons, audit export.
- **LLM layer:** Optional normalization microservice with strict schemas.
- **Agents (if any):** Not required for v1 ranking spine.
- **Tools / Integrations:** ATS APIs, parser workers, HRIS for req metadata.
- **Memory / RDB:** Applicant features, rubric versions, bias metric snapshots.
- **Data sources:** Resumes, job reqs, knockout questions.

---

### 4. Data Flow

1. **Input:** Application id lands; virus scan; PII classification.
2. **Processing:** Parse → canonical skills → compute rubric subscores.
3. **Tool usage:** Optional LLM maps synonyms; post-validate against taxonomy.
4. **Output:** Persist rank + explanation JSON; notify recruiter pool.

---

### 5. Agent Interaction (if applicable)

Optional small LLM steps; hiring decisions remain human/system policy outside model.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by `req_id`; burst handling during job posts.
- **Caching:** JD embeddings per req version for similarity features.
- **Async processing:** Heavy OCR off interactive path.

---

### 7. Failure Handling

- **Retries:** Parser retries with alternate engine flag; quarantine unparseable files.
- **Fallbacks:** If LLM down, use deterministic synonym tables only.
- **Validation:** Reject scores if required fields missing; block export without rubric version.

---

### 8. Observability

- **Logging:** Parse durations, score distributions, demographic parity monitors (aggregated).
- **Tracing:** Apply→rank spans per candidate.
- **Metrics:** Time-to-first-screen, override rate, offer rate by score decile (governed access).
