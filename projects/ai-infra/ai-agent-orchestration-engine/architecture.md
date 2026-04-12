### 1. System Overview

The orchestration engine is a **distributed runtime** that executes **versioned DAGs** of agent nodes. A **scheduler** assigns work to **worker pools**; a **state store** holds checkpoints; a **policy service** gates tool calls. Clients submit runs; observers consume **OTel** streams and **audit tables** for every transition.

---

### 2. Architecture Diagram (text-based)

```
Client / Event bus
        ↓
   Orchestrator API
        ↓
   Scheduler + State store (Postgres)
        ↓
   Worker pool → Agent Node A / B / C (parallel lanes)
        ↓
   Tool gateway (RBAC + quotas)
        ↓
   Merge + validation → checkpoint → next layer
        ↓
   Final artifact + audit export
```

---

### 3. Core Components

- **UI / API Layer:** Run submission, cancel/pause, human approval inbox for gated nodes.
- **LLM layer:** Planner and worker agents; optional critic for merge quality.
- **Agents (if any):** Multiple runtime agents as first-class nodes in the DAG.
- **Tools / Integrations:** MCP proxy, HTTP connectors, internal microservices—never direct from browser.
- **Memory / RAG:** Optional retrieval of runbooks; run-scoped KV for intermediate structured results.
- **Data sources:** Tenant configs, tool manifests, prior run archives (redacted).

---

### 4. Data Flow

1. **Input:** Validate goal + policy; compile DAG template or accept planner-generated DAG after validation.
2. **Processing:** Execute ready nodes; stream partial outputs; persist checkpoints after each side-effect boundary.
3. **Tool usage:** All calls through gateway with signed context; responses stored as typed blobs linked to `node_id`.
4. **Output:** Merge layer produces final JSON/Markdown artifact; emit completion event with cost and latency rollup.

---

### 5. Agent Interaction (if applicable)

**Roles:** Planner decomposes; workers execute narrow tasks; merge layer resolves conflicts using rules + optional critic. **Communication:** strictly via **orchestrator state** (no peer-to-peer agent channels without audit). **Orchestration:** supervisor controls retries, cancellation propagation, and compensation workflows.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by tenant; separate hot schedulers from cold archival.
- **Caching:** Cache compiled DAGs and tool manifest snapshots by version.
- **Async processing:** Long nodes as child workflows with heartbeats; backpressure on queue depth.

---

### 7. Failure Handling

- **Retries:** Per-edge policies; poison nodes quarantined with partial rollback where possible.
- **Fallbacks:** Degrade to single-agent path for low-risk runs when planner unhealthy.
- **Validation:** DAG acyclicity checks, schema validation on node outputs before merge.

---

### 8. Observability

- **Logging:** Structured transition logs with `run_id`, `node_id`, policy version.
- **Tracing:** Parent span per run; child spans per model/tool invocation; baggage for tenant.
- **Metrics:** Queue lag, node failure taxonomy, token burn per stage, human escalation rate.
