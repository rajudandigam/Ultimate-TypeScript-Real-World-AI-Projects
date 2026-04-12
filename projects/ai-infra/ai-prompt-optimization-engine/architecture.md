### 1. System Overview

The engine stores **prompt artifacts** in git or a registry DB. An **optimizer worker** pulls a baseline, runs an **agent loop** that calls a **harness executor**, collects metrics, and emits a **patch proposal PR**. Promotion to production uses **policy gates** (sample size, regression checks, human approval for Tier-0 prompts).

---

### 2. Architecture Diagram (text-based)

```
Prompt registry (git/DB)
        ↓
   Experiment API
        ↓
   Optimizer Agent
     ↙     ↓     ↘
runEval  fetchFailures  proposePatch
        ↓
   Metrics aggregator
        ↓
   PR / promotion ticket → CI gates → deploy flag
```

---

### 3. Core Components

- **UI / API Layer:** Experiment console, reviewer approvals, rollback UI.
- **LLM layer:** Optimizer agent with tool calls capped per experiment.
- **Agents (if any):** Single optimizer; optional critic as separate job.
- **Tools / Integrations:** Harness runner, trace store, git provider, feature flag API.
- **Memory / RAG:** Historical experiment summaries and failure archetypes.
- **Data sources:** Golden datasets, production-sampled traces (redacted, policy-controlled).

---

### 4. Data Flow

1. **Input:** Create experiment with dataset version and constraints.
2. **Processing:** Agent generates candidate patch; validate syntactically; run harness subset.
3. **Tool usage:** Pull failure traces; compute deltas vs baseline; iterate until budget or convergence.
4. **Output:** Open PR with metrics tables; on merge, optional flag service updates prompt version pointer.

---

### 5. Agent Interaction (if applicable)

Single-agent default. Critic, if added, outputs rubric scores only—**merge** uses numeric thresholds, not LLM debate.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Parallel harness shards across workers; queue per tenant.
- **Caching:** Reuse baseline run results when candidate only changes instruction text subset.
- **Async processing:** Long experiments as async jobs with webhooks on completion.

---

### 7. Failure Handling

- **Retries:** Harness flake retries with capped attempts; mark tests flaky after threshold.
- **Fallbacks:** Abort experiment on infrastructure outage; preserve partial metrics.
- **Validation:** Reject patches that widen tool permissions without security label + approval.

---

### 8. Observability

- **Logging:** Experiment id, patch hash, dataset hash, model versions.
- **Tracing:** Trace harness runs as child spans under experiment span.
- **Metrics:** Win rate uplift distributions, cost per experiment, time-to-promotion.
