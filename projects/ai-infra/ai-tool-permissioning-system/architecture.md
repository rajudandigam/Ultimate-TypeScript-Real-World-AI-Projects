### 1. System Overview

**PEP** gateways wrap tool execution: every call requests a **decision** from **PDP** with structured attributes. PDP evaluates **Rego/Cel/Zanzibar** policies loaded from git-backed bundles. **Audit** sink records allow/deny with hashes of args. **JIT** grants stored in Redis with TTL for elevated sessions.

---

### 2. Architecture Diagram (text-based)

```
Agent runtime (PEP)
        ↓ decision request
   PDP cluster (stateless)
        ↓
   Policy bundle registry + relationship DB
        ↓
   Decision + obligations → PEP enforces (execute or block)
        ↓
   Audit / SIEM
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor with CI, access review UI, emergency revoke console.
- **LLM layer:** None on hot path.
- **Agents (if any):** External; must use PEP SDK.
- **Tools / Integrations:** IdP, ITSM for approvals, KMS for signing.
- **Memory / RAG:** Optional human-facing policy docs retrieval—not PDP cache of decisions beyond TTL.
- **Data sources:** Policy bundles, relationship tuples, audit warehouse.

---

### 4. Data Flow

1. **Input:** PEP builds decision request with principal claims, tool id, resource id, environment, payload hash.
2. **Processing:** PDP loads compiled policy version; evaluates; may require step-up token presence.
3. **Tool usage:** If allow with obligations, PEP attaches scoped short-lived credential to downstream tool host.
4. **Output:** Return decision to caller; async write audit; emit metrics.

---

### 5. Agent Interaction (if applicable)

Agents are **clients** of permissioning. Multi-agent systems must pass the same **correlation id** so cross-agent tool calls remain auditable.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless PDP pods behind load balancer; warm policy caches; read replicas for relationship DB.
- **Caching:** Decision cache keyed by `(principal_hash, tool, resource, policy_version)` with very short TTL for high-risk tools disabled.
- **Async processing:** Policy bundle rollout with canary percentage and automatic rollback hooks.

---

### 7. Failure Handling

- **Retries:** Idempotent decision RPCs; fail-closed for high risk on PDP outage if configured.
- **Fallbacks:** Degraded mode with reduced tool surface explicitly advertised to operators.
- **Validation:** Reject policies failing CI tests; reject tool manifests missing risk classification.

---

### 8. Observability

- **Logging:** Allow/deny codes, policy version, latency; avoid raw secrets.
- **Tracing:** Span around PDP call from tool invocation span.
- **Metrics:** Deny spikes, cache hit rate, break-glass usage, PDP error rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Tool Permissioning System**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
