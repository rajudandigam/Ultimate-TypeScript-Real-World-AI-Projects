### 1. System Overview
**IOC bus** ingests from email gateway, browser telemetry, or threat intel. **Case service** tracks lifecycle states. **Outbound mailer** is isolated with rate limits and DKIM for abuse desk identity.

### 2. Architecture Diagram (text-based)
```
IOC → agent (tools) → evidence bundle → human approve
                         ↓
              provider APIs / email → status polling
```

### 3. Core Components
Sandbox fetcher with egress allowlist, artifact vault, RBAC for send rights, audit log immutable, registrar response parsers

### 4. Data Flow
Normalize URL → passive DNS → fetch safe screenshot hash → assemble bundle → score → queue → on approve dispatch → poll until terminal state → close metrics

### 5. Agent Interaction
Agent cannot send mail without signed approval token in workflow context

### 6. Scaling Considerations
Burst campaigns: dedupe by URL hash; shard workers by tld; backoff on provider 429; cache RDAP responses with TTL

### 7. Failure Modes
Provider API schema drift; false cluster merges; leaked credentials in screenshots—schema tests, manual split tool, secret redactor

### 8. Observability Considerations
Cases opened/closed per day, provider response latency, human edit rate on drafts, tool error taxonomy, cost per successful takedown


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Automated Phishing Takedown Agent**:

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
