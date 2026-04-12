### 1. System Overview

**Survey collector** stores **structured preferences** per student. **Matcher service** builds a **constraint graph** and runs a **solver** to propose groups. **Peer Matcher Agent** (optional) helps instructors **iterate** with explanations and small tweaks. **LMS sync workflow** creates groups after approval.

---

### 2. Architecture Diagram (text-based)

```
Survey → prefs table → solver → group proposal
        ↓
Instructor approval → LMS groups API
```

---

### 3. Core Components

- **UI / API Layer:** Student survey, instructor review, swap request inbox.
- **LLM layer:** Optional NL→prefs parser and rationale writer.
- **Agents (if any):** Optional iteration copilot; solver remains source of truth for hard constraints.
- **Tools / Integrations:** LMS roster/groups, optional calendar reads (scoped).
- **Memory / RDB:** Surveys, proposals, approval audit, LMS mapping ids.
- **Data sources:** Course roster, instructor rules, student opt-in fields.

---

### 4. Data Flow

1. **Input:** Close survey window; snapshot prefs immutable version `vK`.
2. **Processing:** Run solver; compute soft-score metrics (skill spread, timezone spread).
3. **Tool usage:** If needed, fetch roster updates for late adds; re-solve delta-minimizing patch.
4. **Output:** Publish proposal; on approve call LMS create with idempotent keys.

---

### 5. Agent Interaction (if applicable)

Agent proposes edits to soft weights or explains unsatisfiable constraints; solver validates feasibility.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch solves per course; large N uses decomposition heuristics.
- **Caching:** Reuse partial solutions for small roster deltas where safe.
- **Async processing:** Heavy solves off request thread with progress webhooks.

---

### 7. Failure Handling

- **Retries:** LMS partial create failures; reconcile with remote state before retry.
- **Fallbacks:** If infeasible, return minimal violating constraints list to instructor.
- **Validation:** Enforce group size bounds before any API write.

---

### 8. Observability

- **Logging:** Solver version, objective values, infeasibility diagnostics (non-PII).
- **Tracing:** Survey close→proposal→LMS spans.
- **Metrics:** Instructor edit distance, student satisfaction, reshuffle counts.
