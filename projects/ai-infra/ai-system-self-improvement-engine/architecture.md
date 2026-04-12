### 1. System Overview

A **supervisor workflow** schedules analysis windows, launches **specialist agents** in parallel, merges their **typed proposals**, runs **shadow evals** when possible, and opens **human approval** tasks for risky diffs. Promotion happens only through **git + CI** or controlled **feature flag** canaries with automated rollback hooks.

---

### 2. Architecture Diagram (text-based)

```
Signals (SLO / eval / incidents)
        ↓
   Improvement Supervisor
     ↙      ↓      ↘
Quality   Cost   Reliability
 Agent     Agent   Agent
        ↓
   Proposal merge + conflict check
        ↓
   Shadow eval / canary plan
        ↓
   Human approval (optional) → PR / flag change
        ↓
   Post-verify tasks → audit archive
```

---

### 3. Core Components

- **UI / API Layer:** Approval inbox, proposal diff viewer, kill switch console.
- **LLM layer:** Specialist agents with narrow tools; supervisor orchestrates budgets.
- **Agents (if any):** Quality, cost, reliability specialists + supervisor merge logic.
- **Tools / Integrations:** Metrics warehouse, trace store, git, CI, feature flags, ITSM.
- **Memory / RAG:** Historical proposals and outcomes for retrieval-augmented planning.
- **Data sources:** OTel-derived rollups, eval dashboards, incident timelines (redacted).

---

### 4. Data Flow

1. **Input:** Trigger fires with scope (`service`, `window`, `risk_tier`).
2. **Processing:** Specialists query allowed datasets; emit `Proposal[]` with evidence links.
3. **Tool usage:** Supervisor validates merges; runs shadow eval job or attaches existing results; opens PR with linked metrics snapshot.
4. **Output:** Await human/CI merge; deploy canary; run post-verify; archive run bundle.

---

### 5. Agent Interaction (if applicable)

**Roles:** Specialists explore different objective functions; supervisor prevents contradictory edits (e.g., cost cut that breaks safety prompt). **Communication:** via structured proposal bus, not chat. **Orchestration:** deadlines, max rounds, explicit deny reasons returned to specialists.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition improvement jobs by service/tenant; isolate heavy eval shards.
- **Caching:** Cache repeated metric queries within a window; reuse eval artifacts across similar proposals.
- **Async processing:** All improvement cycles async; never block online traffic.

---

### 7. Failure Handling

- **Retries:** Data query retries; cancel proposal if evidence incomplete.
- **Fallbacks:** Produce human-readable report only if automation cannot safely propose code changes.
- **Validation:** Schema validation for proposals; reject edits touching deny-listed paths.

---

### 8. Observability

- **Logging:** Proposal ids, merged diff hash, CI run ids, canary stage outcomes.
- **Tracing:** Trace each specialist and eval job under `improvement_run_id`.
- **Metrics:** Merge rate, revert rate, median delta on target KPIs, human override rate.
