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


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Workflow Builder**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres for structured memory; add pgvector only when semantic retrieval is a first-class requirement.
- **Storage layer:** Postgres OLTP, object store (S3/GCS) for artifacts (PDFs, media, large diffs), Redis for ephemeral coordination.
- **Observability layer:** OpenTelemetry traces (LLM + tool spans), metrics on latency/error/cost, structured logs with run IDs.
- **Auth / policy layer:** Session-based auth for UI; service-to-service JWT or mTLS between workers; least-privilege OAuth scopes for SaaS tools.

### Suggested Data and Infra Layer
- **Postgres** for canonical entities, workflow checkpoints, and audit trails.
- **Redis** for dedupe keys, locks, rate limits, and short TTL caches of vendor responses where safe.
- **Object storage** for attachments, exports, and large model outputs referenced by URL.
- **Queue / worker** (BullMQ, SQS, or Temporal activities) for anything exceeding interactive latency budgets.
- **Cron / scheduled jobs** for polling mailboxes, refreshing embeddings, or reconciliation tasks when the blueprint needs them.

### Suggested Runtime and Deployment
- **Next.js on Vercel** when users interact through a browser and you want edge-friendly auth and streaming.
- **Node.js services on Fly.io / Railway / Render / Docker** for webhooks, background agents, and long CPU/GPU steps that exceed serverless limits.
- **Separate worker processes** for ingestion, indexing, and batch eval — keeps user-facing APIs responsive.

### Testing and Evaluation Strategy
- **Vitest** for pure functions, schema validation, and policy engines without network.
- **Contract tests** for outbound HTTP using recorded fixtures; **tool mocks** for LLM unit tests.
- **Structured output snapshots** (JSON Schema validation) instead of brittle full-text asserts.
- **Eval sets** (golden inputs) with regression checks in CI once prompts stabilize.
- **Latency & cost telemetry** compared per release; alert on p95 regressions for critical flows.


### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
