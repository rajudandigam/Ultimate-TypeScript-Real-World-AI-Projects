### 1. System Overview

The generator is a **Plan Service** backed by a **syllabus graph** in Postgres. Learner events update **mastery features**. The agent emits **validated patches** to the active plan version. Instructors approve major deviations via workflow tasks where required.

---

### 2. Architecture Diagram (text-based)

```
Learner profile + goals
        ↓
   Plan API
        ↓
   Syllabus graph loader
        ↓
   Path Agent (tools: mastery, module meta)
        ↓
   DAG validator (server)
        ↓
   Plan version N+1 → LMS sync job
```

---

### 3. Core Components

- **UI / API Layer:** Learner roadmap UI, instructor approval console.
- **LLM layer:** Planning agent with structured patch output.
- **Agents (if any):** Single path agent by default.
- **Tools / Integrations:** LMS, assessment stores, calendar constraints.
- **Memory / RAG:** Retrieved exemplar paths and rubric snippets.
- **Data sources:** Canonical curriculum, cohort benchmarks (aggregated).

---

### 4. Data Flow

1. **Input:** Authenticate learner; load active plan and policy profile.
2. **Processing:** Compute mastery deltas; agent proposes patch with cited evidence ids.
3. **Tool usage:** Fetch module metadata; validate prerequisites; optionally create LMS tasks.
4. **Output:** Persist new plan version; enqueue notifications; log diff summary.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional evaluator is a **separate offline job**, not a second live conversational agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async LMS sync workers; cache syllabus graphs.
- **Caching:** Read-heavy module metadata caching; invalidate on curriculum publish events.
- **Async processing:** Batch recomputation for large cohorts nightly.

---

### 7. Failure Handling

- **Retries:** LMS API retries with idempotency keys.
- **Fallbacks:** Keep last good plan if patch invalid; show instructor queue.
- **Validation:** Reject cyclic graphs; enforce max weekly load constraints.

---

### 8. Observability

- **Logging:** Plan version transitions, patch types, tool failures.
- **Tracing:** Trace plan generation spans per `learner_id` (hashed in logs if needed).
- **Metrics:** Completion rates by plan version, override rate, replan frequency.
