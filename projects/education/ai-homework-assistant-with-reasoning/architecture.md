### 1. System Overview

The assistant is a **session service** with a **policy engine** selecting max hint depth. Each turn calls the model with **structured output**, then optionally runs **sandbox tools** to validate claims. Instructors configure **allowed corpora** and **exam lockdown** windows.

---

### 2. Architecture Diagram (text-based)

```
Student UI
        ↓
   Tutor API (auth + course policy)
        ↓
   Homework Agent
     ↙     ↓     ↘
sandbox  rubric  similarity
        ↓
   Response stream + integrity tags
        ↓
   Audit store (policy-compliant)
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, equation editor, instructor dashboards.
- **LLM layer:** Streaming agent with step schema.
- **Agents (if any):** Primary tutor agent.
- **Tools / Integrations:** Sandboxed code/math engines, LMS read-only links.
- **Memory / RAG:** Instructor-approved snippets only.
- **Data sources:** Problem banks, rubrics, attempt logs (aggregated).

---

### 4. Data Flow

1. **Input:** Student submits attempt + context; system loads `policy_profile`.
2. **Processing:** Model proposes next step; validate schema; run sandbox if STEM path.
3. **Tool usage:** Similarity check vs solution bank; block if too close to forbidden reveal threshold.
4. **Output:** Stream to client; log metadata for instructor review queues.

---

### 5. Agent Interaction (if applicable)

Single agent. Moderation can be a **separate synchronous function** before model call.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; isolate sandbox workers on separate nodes.
- **Caching:** Cache expensive static computations per problem hash.
- **Async processing:** Heavy similarity scans async for non-interactive modes.

---

### 7. Failure Handling

- **Retries:** Model retries on schema failure with repair prompt (capped).
- **Fallbacks:** If sandbox down, switch to conceptual-only mode with banner.
- **Validation:** Hard reject outputs that include direct final answers when disallowed.

---

### 8. Observability

- **Logging:** Hint level distribution, policy hits, sandbox failures.
- **Tracing:** Trace each tool invocation under `session_id`.
- **Metrics:** Integrity violation attempts, session completion rate, human review backlog.
