### 1. System Overview
**Lab orchestrator** provisions targets from IaC. **Supervisor agent** enforces **scope tokens**. **Worker agents** run in **microVMs** with **egress deny by default** except allowlisted scanner endpoints.

### 2. Architecture Diagram (text-based)
```
Scope → lab provision → recon agent → validator agent
                         ↓
              findings DB → report agent → human release
```

### 3. Core Components
Policy compiler, execution sandbox, secrets vault, artifact store (pcaps, HAR), ticketing integration, audit service

### 4. Data Flow
Signed scope JSON → compile ACLs → dispatch jobs → stream events to SIEM test sink → aggregate findings with CWE/CVE links → export SARIF + narrative

### 5. Agent Interaction
Agents cannot read each other’s scratch memory; only structured bus messages; supervisor can hard-stop all runners

### 6. Scaling Challenges
Parallel chains vs CPU; noisy neighbor in shared lab; long-running scans need checkpoint/resume

### 7. Failure Handling
Any scope parse error → refuse start; exploit tool crash → isolated restart; leak detection heuristics abort run

### 8. Observability Considerations
Per-agent tool latency, egress attempts blocked, finding severity mix, human override reasons, $/engagement vs traditional pentest baseline


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Autonomous Penetration Testing Agents (PentAGI)**:

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
