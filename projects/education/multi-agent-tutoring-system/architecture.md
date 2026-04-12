### 1. System Overview

The supervisor workflow stores **session state** and routes each learner turn to **explainer**, then **evaluator**, then **feedback** as needed. Each agent returns **structured artifacts** merged into a canonical timeline. Human review tasks open when **confidence** is low or **integrity** flags trigger.

---

### 2. Architecture Diagram (text-based)

```
Learner UI
        ↓
   Tutoring Supervisor
     ↙      ↓      ↘
Explainer  Evaluator  Feedback
 agent       agent      agent
     ↘      ↓      ↙
   Tools (sandbox, rubric, LMS read)
        ↓
   Merge + policy validation
        ↓
   Learner-visible transcript + grades draft
```

---

### 3. Core Components

- **UI / API Layer:** Student chat, instructor oversight, appeals workflow.
- **LLM layer:** Three role-tuned models or shared model with strict prompts + separate tool scopes.
- **Agents (if any):** Explainer, evaluator, feedback agents.
- **Tools / Integrations:** Sandbox, rubric DB, similarity detection, LMS APIs.
- **Memory / RAG:** Allowed corpus chunks; session summaries with redaction rules.
- **Data sources:** Curriculum artifacts, attempt history, policy packs.

---

### 4. Data Flow

1. **Input:** Receive learner message; attach `session_id`, `course_policy_version`.
2. **Processing:** Explainer proposes teaching move; evaluator scores with evidence; feedback proposes next steps without altering score unless policy allows revision rounds.
3. **Tool usage:** Each tool call logged with outputs hashed; supervisor validates merge.
4. **Output:** Persist merged timeline; optionally enqueue LMS grade draft for instructor approval.

---

### 5. Agent Interaction (if applicable)

**Roles:** Explainer teaches; evaluator judges; feedback motivates and plans next tasks. **Communication:** through supervisor objects (`explanation`, `evaluation`, `feedback_plan`). **Orchestration:** max rounds, dispute handling, and human escalation on low confidence.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; separate worker pools per agent role; queue burst traffic.
- **Caching:** Cache rubric payloads; avoid caching learner-specific merged outputs across users.
- **Async processing:** Heavy evaluation or similarity scans async for non-blocking UX where acceptable.

---

### 7. Failure Handling

- **Retries:** Per-agent retries with backoff; supervisor partial output with explicit gaps on timeout.
- **Fallbacks:** Human TA takeover mode with prefilled evidence bundle.
- **Validation:** Reject merges if evaluator evidence missing for numeric grades.

---

### 8. Observability

- **Logging:** Role outputs as structured JSON; redact sensitive student content per policy.
- **Tracing:** Span per agent under `session_id`; measure merge latency.
- **Metrics:** Human override rate, disagreement rate between evaluator and instructor, tool failure rate.
