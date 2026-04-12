### 1. System Overview

The product splits **authoring** and **execution**. Authoring is a React app talking to an **Authoring API** that hosts the agent and compiler. Execution is a **worker fleet** running versioned workflow bundles pulled from an artifact store. The agent never executes side effects directly—it only proposes **validated graph operations**.

---

### 2. Architecture Diagram (text-based)

```
User (NL + UI)
        ↓
   Authoring API
        ↓
   Workflow Authoring Agent
     ↙   ↓   ↘
validate   simulate   listConnectors
        ↓
   Compiler (deterministic)
        ↓
   Workflow artifact store (versioned)
        ↓
   Runtime workers (Temporal / Inngest / custom)
        ↓
   External APIs (connectors)
```

---

### 3. Core Components

- **UI / API Layer:** Graph editor, NL panel, publish pipeline with approvals.
- **LLM layer:** Authoring agent with operation-level tools.
- **Agents (if any):** Primary authoring agent; optional policy linter without write tools.
- **Tools / Integrations:** Connector registry, schema validators, simulators, secret vault APIs.
- **Memory / RAG:** Internal docs and example flows for retrieval-augmented authoring.
- **Data sources:** Connector OpenAPI specs, prior internal automations, audit logs.

---

### 4. Data Flow

1. **Input:** User describes intent; system loads org connector allowlist and policy pack.
2. **Processing:** Agent proposes ops; compiler applies and returns errors/warnings.
3. **Tool usage:** Simulator runs selected nodes with mocked/sandbox credentials.
4. **Output:** Published artifact triggers deployment to execution tier; runtime emits traces back to same UI.

---

### 5. Agent Interaction (if multi-agent)

Optional **linter agent** reviews compiled graph for security patterns; communicates only via structured findings to the authoring loop—no direct graph writes.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Scale runtime workers independently from low-traffic authoring API.
- **Caching:** Cache connector schemas; cache simulation results for unchanged subgraphs.
- **Async processing:** Long simulations and compile jobs as background tasks with progress UI.

---

### 7. Failure Handling

- **Retries:** Runtime retries per node policy; authoring tool retries with backoff.
- **Fallbacks:** If agent stuck, offer template library path; manual edit always available.
- **Validation:** Hard fail publish on compiler errors; soft warnings require explicit acknowledgment.

---

### 8. Observability

- **Logging:** Structured logs per `workflow_id`, `version`, `execution_id`.
- **Tracing:** Trace each node execution; link back to authoring session for regressions.
- **Metrics:** Compile success rate, sim mismatch rate, mean nodes per workflow, top failing connectors.
