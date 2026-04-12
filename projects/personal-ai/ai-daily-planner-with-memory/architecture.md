### 1. System Overview

A **daily compile workflow** pulls calendar and tasks, builds a **candidate interval graph**, and optionally calls a **planner agent** for patch proposals. Accepted patches update **memory features**. Notifications are scheduled as separate activities with cancellation tokens.

---

### 2. Architecture Diagram (text-based)

```
Calendar / task sync (workflow)
        ↓
   Interval graph builder
        ↓
   Planner Agent (optional NL edits)
        ↓
   Validator (no overlaps, respects pins)
        ↓
   Persist plan + memory updates
        ↓
   Reminder scheduler
```

---

### 3. Core Components

- **UI / API Layer:** Day view, command palette, conflict resolver.
- **LLM layer:** Planner agent emitting structured patches.
- **Agents (if any):** Single planner agent.
- **Tools / Integrations:** Calendar APIs, maps for commute, task systems.
- **Memory / RAG:** Preference store + optional note retrieval.
- **Data sources:** User-authorized calendars/tasks only.

---

### 4. Data Flow

1. **Input:** Sync triggers or user command; load timezone and pinned blocks.
2. **Processing:** Build graph; if NL command, run agent to propose patch set.
3. **Tool usage:** Fetch updated events if needed; validate travel buffers via API.
4. **Output:** Save plan version; enqueue push notifications; update memory if user accepts suggestions.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional future split is **read planner** vs **write executor** services, not chatty multi-agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; compile workers scaled independently; shard by user.
- **Caching:** Cached free-busy summaries with short TTL.
- **Async processing:** Nightly weekly planning as larger compile jobs.

---

### 7. Failure Handling

- **Retries:** Calendar API retries; compile job retries from last checkpoint.
- **Fallbacks:** Read-only calendar mode with banner when write scopes missing.
- **Validation:** Reject patches overlapping pinned events; enforce sleep blocks if configured.

---

### 8. Observability

- **Logging:** Compile durations, patch types, OAuth refresh failures.
- **Tracing:** Trace compile + agent spans per `user_id` (internal).
- **Metrics:** Edit rate after auto-plan, notification dismissal rate, sync error taxonomy.
