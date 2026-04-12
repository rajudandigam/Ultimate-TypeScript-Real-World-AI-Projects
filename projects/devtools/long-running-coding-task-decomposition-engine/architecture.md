### 1. System Overview

**Orchestrator service** accepts a **task spec** and acquires a **repo lease**. **Planner** emits a **DAG** of steps stored in **Postgres**. **Worker** runs the **Coding Agent** loop inside a **sandbox** with tool adapters. **Checkpoint workflow** persists state after each validated milestone; **PR service** opens/updates pull requests.

---

### 2. Architecture Diagram (text-based)

```
Task spec → orchestrator → plan store
        ↓
Sandbox worker → Coding Agent (tools)
        ↓
Git branch / PR → human review → merge
```

---

### 3. Core Components

- **UI / API Layer:** Task console, diff viewer, kill switch, budget editor.
- **LLM layer:** Primary tool-using agent; optional reviewer model (read-only tools).
- **Agents (if any):** Primary agent + optional reviewer (policy-separated).
- **Tools / Integrations:** Git, package manager, test runner, linter, code index.
- **Memory / RAG:** Repo chunk index at pinned commit; checkpoint blobs.
- **Data sources:** Issue tracker links, design docs, CI configs.

---

### 4. Data Flow

1. **Input:** Validate spec schema; freeze target branch SHA optional.
2. **Processing:** Generate/refresh plan; execute next ready step with sandbox token.
3. **Tool usage:** Patch → run tests → capture logs → update checkpoint.
4. **Output:** Push commits; update PR description with evidence appendix.

---

### 5. Agent Interaction (if applicable)

Single writer agent by default; reviewer posts comments only. Multi-writer requires strict file-level locking.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue tasks; **one active lease per repo:branch** to avoid conflicts.
- **Caching:** Incremental compile caches in sandbox volumes (ephemeral).
- **Async processing:** Long test suites streamed to object storage for later summarization.

---

### 7. Failure Handling

- **Retries:** Transient sandbox failures; never auto-merge on flaky green.
- **Fallbacks:** Pause with actionable error; notify human if budget exceeded.
- **Validation:** Patch grammar checks; deny binary file edits unless allowlisted.

---

### 8. Observability

- **Logging:** Step ids, tool latencies, redaction counts, policy violations.
- **Tracing:** Task-level trace across sandbox and git operations.
- **Metrics:** Task completion rate, human intervention rate, CI cost per task.
