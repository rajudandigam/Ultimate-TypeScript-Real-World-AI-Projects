### 1. System Overview

The registry is a **control plane** in front of MCP tool servers. Clients (IDE agents, web copilots, batch workers) speak MCP to a **router proxy** that authenticates the caller, evaluates **OPA policies**, attaches **scoped credentials**, executes the tool in a **sandbox runner** when needed, and writes an **audit event**. Optional LLM agents assist humans with **discovery and documentation**, not runtime authorization.

---

### 2. Architecture Diagram (text-based)

```
Client (Copilot / IDE / service agent)
        ↓ MCP
   Registry Router (authN/Z + quotas)
        ↓
┌─────────────────────────────────────────────┐
│ Tool runners (isolated) → MCP servers       │
└─────────────────────────────────────────────┘
        ↑
   Policy engine (OPA) ←── Admin policy repo
        ↑
   Optional: Discovery Agent (read-only registry tools)
        ↑
   Optional: Policy Explainer Agent (read-only)
        ↓
   Audit store + SIEM export
```

---

### 3. Core Components

- **UI / API Layer:** Admin console, developer portal, approval workflows for new tools.
- **LLM layer:** Optional agents for docs/schema assistance; never the sole authorizer.
- **Agents (if any):** Discovery/explainer agents (optional); client agents remain external.
- **Tools / Integrations:** MCP servers for SaaS systems; OAuth brokers; secret stores.
- **Memory / RAG:** Tool documentation index; policy rationale snippets (non-authoritative).
- **Data sources:** Published tool manifests, OpenAPI imports, ownership metadata from CMDB.

---

### 4. Data Flow

1. **Input:** Client sends MCP request with session principal and requested tool/version.
2. **Processing:** Router resolves manifest, evaluates policy with context (tenant, risk class, scopes).
3. **Tool usage:** On allow, proxy invokes runner with injected short-lived token; stream results back with size caps.
4. **Output:** Response to client + audit record + metrics increment; deny returns typed error with remediation hint.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Discovery agent helps humans find tools; explainer agent summarizes policy decisions using logs (read-only). **Communication:** both read through registry APIs, never bypass router. **Orchestration:** humans approve risky publishes; automated systems handle routine health checks.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless routers; scale runners per tool pool; isolate noisy tools.
- **Caching:** Manifest cache with ETags; negative caching for denies cautiously (short TTL).
- **Async processing:** Heavy OpenAPI imports and test harness runs as background jobs.

---

### 7. Failure Handling

- **Retries:** Safe retries on transient runner failures; no duplicate side effects without idempotency keys.
- **Fallbacks:** If discovery LLM down, UI falls back to keyword search on manifests.
- **Validation:** Strict JSON Schema validation; reject unknown tool versions unless explicitly allowlisted.

---

### 8. Observability

- **Logging:** Structured audit events exported to SIEM; separate debug logs without secrets.
- **Tracing:** Trace router → runner → downstream MCP with shared `trace_id`.
- **Metrics:** Allow/deny rates, per-tool latency/error SLOs, hot tools, unusual cross-tool call sequences.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **MCP Tool Registry System**:

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
