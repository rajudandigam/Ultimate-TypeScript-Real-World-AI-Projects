### 1. System Overview

The assistant is a **TypeScript API** behind a **React** hiring UI. Candidate documents never pass through the browser model directly; the server builds a **redacted context pack** per policy, runs the agent, and stores an **audit record** with citations. ATS integrations are **draft-first** writes.

---

### 2. Architecture Diagram (text-based)

```
Recruiter UI (SSO)
        ↓
   Hiring API (authZ + policy)
        ↓
   Hiring Agent (LLM + tools)
     ↙     ↓     ↘
 fetchJob  fetchRubric  draftATSNnote
        ↓
   Review packet store (Postgres)
        ↓
   ATS (draft fields) / export PDF
```

---

### 3. Core Components

- **UI / API Layer:** Role-based UI, consent flows, export controls.
- **LLM layer:** Structured generation with mandatory citations for claims about candidate facts.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** ATS APIs, internal rubric store, scheduling links (optional).
- **Memory / RAG:** Retrieval of competency docs; minimal retention of candidate embeddings (prefer none).
- **Data sources:** Applications, resumes, job postings, internal ladders.

---

### 4. Data Flow

1. **Input:** Recruiter selects candidate + role; system verifies permissions and jurisdiction flags.
2. **Processing:** Fetch docs; normalize text; chunk resumes with offsets for citations.
3. **Tool usage:** Agent may pull rubric updates; writes ATS notes only as drafts pending submit.
4. **Output:** Render structured packet; log model + rubric versions for audits.

---

### 5. Agent Interaction (if multi-agent)

Single agent by default. Optional compliance pass as separate **stateless service** that returns flags without storing candidate text.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; queue heavy OCR/extraction jobs.
- **Caching:** Cache job descriptions and rubrics; never cache cross-candidate merged data.
- **Async processing:** Large PDFs processed asynchronously with webhook completion.

---

### 7. Failure Handling

- **Retries:** ATS retries with idempotency keys on draft creates.
- **Fallbacks:** If model unavailable, fall back to checklist UI without AI narrative.
- **Validation:** Refuse outputs that claim facts without citations; strip inferred protected attributes.

---

### 8. Observability

- **Logging:** Access logs with candidate ids hashed where possible; separate security monitoring.
- **Tracing:** Trace tool calls and model spans per review session.
- **Metrics:** Time-to-first-draft, human edit rate, policy block counts.
