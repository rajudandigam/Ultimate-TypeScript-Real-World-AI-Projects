### 1. System Overview

The framework is a **runner service** plus **artifact store**. Test definitions live in git. Each CI job requests a **suite execution**; workers pull cases, invoke the **system under test** in a sandbox, score outputs, and upload **reports**. A **gate service** compares against baselines and blocks merges on regressions.

---

### 2. Architecture Diagram (text-based)

```
CI / API trigger
        ↓
   Suite scheduler
        ↓
   Case workers (parallel)
     ↓
   SUT sandbox (LLM app + mocks)
        ↓
   Scorers (rules / JSONMatch / LLM-judge)
        ↓
   Report aggregator → artifact store
        ↓
   Gate / PR comment
```

---

### 3. Core Components

- **UI / API Layer:** Suite explorer, flake triage, dataset management with ACL.
- **LLM layer:** SUT and optional judges; isolated credentials per role.
- **Agents (if any):** SUT may be agentic; harness itself is not an open agent by default.
- **Tools / Integrations:** Mock tool servers, vector fixture servers, HTTP wiremock.
- **Memory / RAG:** Frozen corpora snapshots referenced by `corpus_version`.
- **Data sources:** YAML/TS case definitions, golden files, synthetic user profiles.

---

### 4. Data Flow

1. **Input:** Validate suite manifest; lock versions for model, dataset, corpus, and SUT build.
2. **Processing:** Shard cases to workers; execute with per-case timeout and retry policy for infra only.
3. **Tool usage:** Record tool traces; score expected call patterns; attach stdout/stderr artifacts.
4. **Output:** Upload report; compute diff vs baseline branch; post summary to PR.

---

### 5. Agent Interaction (if applicable)

Harness orchestration is **workflow-only**. Multi-agent appears only **inside** SUT or inside scripted adversarial scenarios.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Autoscale workers with queue depth; isolate noisy suites to dedicated pools.
- **Caching:** Reuse SUT container layers; cache fixture corpora on workers.
- **Async processing:** Nightly full suites vs PR subset runs.

---

### 7. Failure Handling

- **Retries:** Infra-only retries with jitter; mark case flaky after repeated infra failures.
- **Fallbacks:** Publish partial report with explicit “incomplete suite” banner if quota exceeded.
- **Validation:** Reject manifests referencing unreleased dataset versions.

---

### 8. Observability

- **Logging:** Case-level pass/fail reasons; correlation ids across workers.
- **Tracing:** Trace each SUT invocation; propagate `suite_run_id`.
- **Metrics:** p95 case duration, flake rate, judge disagreement rate, cost per suite.
