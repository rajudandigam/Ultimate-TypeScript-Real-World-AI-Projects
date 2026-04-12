### 1. System Overview

A **scan orchestrator** enqueues jobs per repo commit. Each job runs in an **isolated worker** executing static analyzers and tests, capturing **machine-readable outputs**. An **auditor agent** consumes outputs and emits **structured findings** with citations. A **governance layer** controls disclosure, ignore rules, and severity overrides.

---

### 2. Architecture Diagram (text-based)

```
CI / upload webhook
        ↓
   Scan orchestrator → job queue
        ↓
   Sandbox worker (Slither, tests, SBOM)
        ↓
   Artifact store (logs, SARIF-like JSON)
        ↓
   Auditor Agent (read-only tools)
        ↓
   Findings DB + PR comment / dashboard
```

---

### 3. Core Components

- **UI / API Layer:** Upload/CI config, triage console, waiver workflow.
- **LLM layer:** Synthesis agent with strict citation rules.
- **Agents (if any):** Single auditor agent.
- **Tools / Integrations:** Static analyzers, test runners, SCM webhooks.
- **Memory / RAG:** Optional private corpus retrieval with licensing controls.
- **Data sources:** Source trees, build artifacts, dependency manifests.

---

### 4. Data Flow

1. **Input:** Receive repo ref; fetch source in sandbox; compute lockfile hash.
2. **Processing:** Run analyzers with timeouts; collect stdout/stderr as artifacts.
3. **Tool usage:** Agent queries artifacts; may request additional targeted scans (bounded).
4. **Output:** Persist findings; notify CI; block merge only if policy says so.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional split: **runner** (no LLM) vs **writer** (LLM) communicating via files only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Autoscale sandbox workers; separate GPU/CPU pools if needed.
- **Caching:** Cache analysis results keyed by `(commit, tool_versions, lockfile_hash)`.
- **Async processing:** Long fuzz jobs as lower-priority queues.

---

### 7. Failure Handling

- **Timeouts:** Hard caps per stage; partial reports labeled incomplete.
- **Fallbacks:** If LLM unavailable, ship raw tool output to UI.
- **Validation:** Schema validation on findings; reject uncited critical claims.

---

### 8. Observability

- **Logging:** Job durations, tool exit codes, resource usage, scan outcomes.
- **Tracing:** Trace `job_id` across queue, sandbox, agent.
- **Metrics:** Findings per KLOC, false positive rate from human labels, sandbox failure rate.
