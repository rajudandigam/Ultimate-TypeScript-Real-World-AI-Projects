### 1. System Overview

**Model registry** stores quantitative planning models with **versioned assumptions**. **Forecast service** recomputes outputs deterministically. **Scenario agent** reads outputs and proposes **validated driver changes** through tools. **Audit log** captures NL requests mapped to structured patches.

---

### 2. Architecture Diagram (text-based)

```
Driver UI + NL input
        ↓
   Scenario BFF (auth + RBAC)
        ↓
   Scenario Agent (tools: query, patch, compare)
        ↓
   Forecast engine → artifacts
        ↓
   Narrative + charts → users
```

---

### 3. Core Components

- **UI / API Layer:** Scenario tree browser, approvals for sensitive drivers, exports.
- **LLM layer:** Translation + explanation agent grounded in model JSON.
- **Agents (if any):** Single agent per workspace session.
- **Tools / Integrations:** Warehouse read APIs, spreadsheet exports, notification webhooks.
- **Memory / RAG:** Methodology docs; prior quarter commentary (ACL).
- **Data sources:** ERP/warehouse aggregates, user assumptions.

---

### 4. Data Flow

1. **Input:** User edits drivers or asks NL question; system resolves active `model_version`.
2. **Processing:** If NL, agent proposes patch; validator checks bounds and dependencies.
3. **Tool usage:** Run forecast; fetch series; compare scenarios; generate diff tables.
4. **Output:** Persist scenario snapshot; render charts; attach narrative with citations to tables.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional **critic** can be a deterministic ruleset (not LLM) for policy violations.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; autoscale forecast workers; cache hot warehouse queries.
- **Caching:** Memoize forecast results by assumption hash; invalidate on driver updates.
- **Async processing:** Long sweeps and Monte Carlo as batch jobs.

---

### 7. Failure Handling

- **Retries:** Warehouse retries; forecast retries with smaller batch if OOM.
- **Fallbacks:** Serve last good scenario with banner if data stale.
- **Validation:** Reject patches that break accounting constraints checked in code.

---

### 8. Observability

- **Logging:** Model versions, patch types, forecast durations, export events.
- **Tracing:** Trace `scenario_id` through patch → forecast → narrative.
- **Metrics:** Close-week traffic, queue latency, human override rate, cost per forecast cycle.
