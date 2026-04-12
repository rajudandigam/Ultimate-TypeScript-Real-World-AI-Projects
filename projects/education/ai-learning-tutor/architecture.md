### 1. System Overview

The tutor is a **session service** backed by a **curriculum store** and **learner profile store**. Each turn retrieves **allowed** lesson chunks, updates a **mastery estimator** from tool-logged attempts, and streams model output to the client. Progression gates are enforced by **server rules**, not the model.

---

### 2. Architecture Diagram (text-based)

```
Learner UI
        ↓
   Tutor API (auth + course scope)
        ↓
   Curriculum retrieval (ACL + license tags)
        ↓
   Tutoring Agent (LLM + tools)
     ↙     ↓     ↘
fetchLesson logAttempt  getSkillGraph
        ↓
   Pedagogy policy (rules)
        ↓
   Response stream + mastery update event
```

---

### 3. Core Components

- **UI / API Layer:** Lesson player, chat pane, exercise widgets, teacher dashboard (optional).
- **LLM layer:** Streaming agent with tool calls for pedagogy actions.
- **Agents (if any):** Primary tutor agent.
- **Tools / Integrations:** LMS APIs if needed, internal content CMS, code sandbox service.
- **Memory / RAG:** Chunk index over course materials; learner state in relational tables.
- **Data sources:** Licensed texts, instructor-authored items, assessment item bank.

---

### 4. Data Flow

1. **Input:** Authenticate learner; resolve `course_id`, `module_id`, and policy profile.
2. **Processing:** Retrieve grounded chunks; assemble prompt with mastery summary features.
3. **Tool usage:** Log answers to exercises; fetch prerequisites when mastery checks fail server-side.
4. **Output:** Stream explanation; emit structured `next_resource` for UI; persist events for analytics.

---

### 5. Agent Interaction (if applicable)

Single agent for learner-facing flow. Moderation or content generation should be **offline pipelines**, not competing live agents unless product requirements demand it.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless tutor API; separate read-heavy retrieval service; cache hot modules.
- **Caching:** CDN for static assets; edge cache for public course metadata only (no PII).
- **Async processing:** Heavy analytics (learning curves) in warehouse jobs.

---

### 7. Failure Handling

- **Retries:** Transient model errors with fallback model; retrieval retries with alternate index.
- **Fallbacks:** If retrieval empty, switch to “ask instructor” flow with templated message.
- **Validation:** Block progression APIs if server rules not satisfied, regardless of model text.

---

### 8. Observability

- **Logging:** Pedagogy events with hashed learner ids; avoid storing raw chat in untrusted sinks.
- **Tracing:** Trace retrieval + model spans per session turn.
- **Metrics:** Stuck-learner detection signals, hint usage rate, mastery convergence, moderation triggers.
