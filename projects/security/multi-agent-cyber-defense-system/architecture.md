### 1. System Overview

Alerts enter a **correlation workflow** that builds an **incident graph** (entities, edges, evidence pointers). A **supervisor** dispatches tasks to **Intrusion Detector**, **Response**, and **Mitigation Planner** agents with **scoped toolsets**. Approved actions execute via an **action executor** service with **receipts** and **compensation hooks**.

---

### 2. Architecture Diagram (text-based)

```
SIEM / EDR alerts
        ↓
   Correlation workflow → incident graph (Postgres)
        ↓
   Supervisor (policy + approvals)
     ↙      ↓       ↘
Detector   Response   Planner
 (read+)   (execute*)  (sequence)
        ↓
   Approval queue (human)
        ↓
   Executor → cloud/EDR APIs
        ↓
   Audit + updated graph
```

*Execute tools only after approval tokens in production designs.

---

### 3. Core Components

- **UI / API Layer:** Incident console, approvals, rollback wizard.
- **LLM layer:** Three specialist agents + supervisor orchestration.
- **Agents (if any):** Intrusion detector, response agent, mitigation planner.
- **Tools / Integrations:** SIEM query, EDR actions, ticketing, firewall management.
- **Memory / RAG:** Runbooks and historical incidents (governed retrieval).
- **Data sources:** Security telemetry, CMDB, IAM directory metadata.

---

### 4. Data Flow

1. **Input:** Normalize alerts into entities; dedupe into incident candidates.
2. **Processing:** Detector proposes hypotheses with evidence IDs; planner proposes remediation DAG.
3. **Tool usage:** Read tools widely; write tools only through executor after approval.
4. **Output:** Update incident state; notify stakeholders; schedule verification checks.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves conflicts (e.g., planner vs responder timing), merges outputs into a single incident timeline, and enforces **stop conditions** (budgets, irreversible actions).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition incidents by tenant; scale executor workers independently from LLM workers.
- **Caching:** Read-through caches for CMDB lookups with short TTL.
- **Async processing:** Heavy log searches as background activities with partial results streaming to UI.

---

### 7. Failure Handling

- **Retries:** Tool retries with jitter; saga compensation on partial failures.
- **Fallbacks:** Manual mode if automation disabled for tenant during maintenance.
- **Validation:** Pre-flight checks (maintenance flags, ownership tags) before containment.

---

### 8. Observability

- **Logging:** Structured action logs with correlation IDs; no secrets in messages.
- **Tracing:** Trace per `incident_id` across agents and executor.
- **Metrics:** MTTR/MTTC proxies, automation success rate, human override reasons, false positive containment tracking.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Multi-Agent Cyber Defense System**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres for structured memory; add pgvector only when semantic retrieval is a first-class requirement.
- **Storage layer:** Postgres OLTP, object store (S3/GCS) for artifacts (PDFs, media, large diffs), Redis for ephemeral coordination.
- **Observability layer:** OpenTelemetry traces (LLM + tool spans), metrics on latency/error/cost, structured logs with run IDs.
- **Auth / policy layer:** RBAC + scoped API keys + audit logs on every tool invocation; MCP-style tool manifests if multiple clients consume the same backend.

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
