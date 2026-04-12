### 1. System Overview

Strategy artifacts (code or DSL) are submitted with **config** to a **validation orchestrator**. **Sim workers** execute backtests in **isolated sandboxes** producing **metrics bundles**. **Multi-agent review** consumes metrics and code diffs to produce a **gate decision** stored with **evidence links**. CI blocks merges when gates fail.

---

### 2. Architecture Diagram (text-based)

```
Strategy commit / UI submit
        ↓
   Validation orchestrator
        ↓
   Sim cluster (deterministic workers)
        ↓
   Metrics store (Postgres + object store for curves)
        ↓
   Multi-agent review (author / critic / supervisor)
        ↓
   Report + CI gate status
```

---

### 3. Core Components

- **UI / API Layer:** Experiment browser, approvals, cost estimator.
- **LLM layer:** Multi-agent critique loop over structured artifacts.
- **Agents (if any):** Strategy author agent, adversarial critic, supervisor; sim is non-LLM service.
- **Tools / Integrations:** Git, sim APIs, data catalog, plotting export.
- **Memory / RAG:** Prior run retrieval by strategy family and feature tags.
- **Data sources:** Licensed market data, synthetic fixtures for unit tests.

---

### 4. Data Flow

1. **Input:** Validate strategy package signature; freeze data slice version and random seeds.
2. **Processing:** Queue sim jobs; aggregate metrics; detect anomalies vs baseline run.
3. **Tool usage:** Agents request additional sims only through budgeted tool calls returning JSON.
4. **Output:** Publish signed report artifact; update CI status; notify owners.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves disagreements between author and critic using rubric scores; can require **human quant** approval for borderline cases.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Autoscale sim workers; separate GPU pools if needed; priority queues per team.
- **Caching:** Cache run results keyed by `(strategy_hash, data_version, params_hash)`.
- **Async processing:** Large sweeps as batch jobs with partial result streaming to UI.

---

### 7. Failure Handling

- **Retries:** Sim worker retries on transient infra failures; fail if nondeterministic mismatch detected.
- **Fallbacks:** Degrade to smaller data window with explicit banner when budget exceeded.
- **Validation:** Static lint for lookahead patterns; reject strategies exceeding resource caps.

---

### 8. Observability

- **Logging:** Job durations, failure taxonomy, agent tool usage counts, cost per run.
- **Tracing:** Trace `validation_id` across queue, sim, and agent phases.
- **Metrics:** Gate pass rate, time-to-validate, sim cluster saturation, seeded bug detection rate in tests.
