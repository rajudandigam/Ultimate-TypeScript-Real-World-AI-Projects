### 1. System Overview
**Monorepo** hosts `legacy/`, `generated/`, and `tests/`. **CI** runs parser, graph checks, and parity suites on every PR. **Artifact store** keeps COBOL snapshots immutable.

### 2. Architecture Diagram (text-based)
```
COBOL + copybooks → parser → symbol graph → slice plan
                              ↓
            codegen agent → TS modules → tests → PR
```

### 3. Core Components
Parser service, graph DB, golden dataset vault, shadow execution harness (containerized mainframe stub), policy engine (PII fields never in prompts)

### 4. Data Flow
Import version tag → parse all units → resolve copybooks → build call graph → identify IO seams → generate adapter interfaces → emit TS → compile → run property tests → attach diff report

### 5. Agent Interaction
Agent writes only to `generated/` branch folders; human merges; no network deploy tools without break-glass role

### 6. Scaling Considerations
Millions of LOC: incremental parse cache by file hash; parallelize slices; cap LLM context with summarized graph neighborhoods only

### 7. Failure Modes
Parser ambiguity on dialect extensions; graph cycles in PERFORM graph—manual annotation files, fail CI until resolved

### 8. Observability Considerations
Parse error taxonomy, codegen token usage, test failure heatmap, human review hours per KLOC, regression rate post-release


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Legacy Code Refactor Agent (COBOL to TypeScript)**:

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
- **Human review queues** with sampling for high-risk outputs (finance, health, security).

### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
