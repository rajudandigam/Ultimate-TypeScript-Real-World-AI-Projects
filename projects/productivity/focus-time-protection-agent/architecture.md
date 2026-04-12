### 1. System Overview

**Client or bot command** requests a **focus session**. **Focus Agent** validates policy, computes **end time**, and issues **tool calls** to integrations. **Watchdog workflow** ensures **restore** on completion, crash, or user panic button.

---

### 2. Architecture Diagram (text-based)

```
User intent → Focus Agent → integration tools
        ↓
Session record → watchdog timer → restore tools
```

---

### 3. Core Components

- **UI / API Layer:** Desktop helper, Slack slash command, mobile shortcut.
- **LLM layer:** Optional NL parser to structured `FocusSession` schema.
- **Agents (if any):** Single agent per session setup.
- **Tools / Integrations:** Slack/Teams, calendar, optional OS hooks via companion app.
- **Memory / RDB:** Session table with desired vs actual state machine.
- **Data sources:** Calendar busy data, on-call schedules (optional).

---

### 4. Data Flow

1. **Input:** Parse command; load user policy (allowlists, working hours).
2. **Processing:** Detect conflicts; ask user to confirm if partial apply needed.
3. **Tool usage:** Apply DND + optional calendar focus block; store previous state snapshot.
4. **Output:** Confirm to user; post optional team-visible status.

---

### 5. Agent Interaction (if applicable)

Single agent; restore is workflow-enforced, not best-effort LLM promise.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; per-user serialization to avoid conflicting toggles.
- **Caching:** Short TTL cache of integration tokens; refresh proactively.
- **Async processing:** Deferred notifications batching during focus (queue in outbox).

---

### 7. Failure Handling

- **Retries:** Transient API errors on apply; never lose restore snapshot.
- **Fallbacks:** If restore fails, escalate user notification and retry with backoff.
- **Validation:** Schema-validate NL output; deny impossible durations or illegal blocks.

---

### 8. Observability

- **Logging:** Session ids, integration error codes, restore success boolean.
- **Tracing:** Apply→active→restore spans.
- **Metrics:** Sessions per user/week, override rate, stuck-state incidents (should be ~0).
