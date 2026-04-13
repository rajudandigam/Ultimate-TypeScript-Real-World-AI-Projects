### 1. System Overview
**Inventory graph** nodes are SKUs with qty and expiry distributions. **Scan pipeline** writes provisional nodes pending user confirm. **Agent** reads graph snapshot id.

### 2. Architecture Diagram (text-based)
```
Scan → inventory graph → meal agent → recipe tools
                  ↓
           meal plan + gap list → notifications
```

### 3. Core Components
On-device model bundle server, cloud fallback queue, recipe CMS with licensing, nutrition calculator service, audit of vision images deleted after N days

### 4. Data Flow
Capture image → classify items → user corrects → lock inventory → propose meals consuming expiring nodes → compute shortfall → optional e-commerce handoff (policy gated)

### 5. Agent Interaction
Recipes must come from tool-backed IDs; substitutions require explicit user allergen profile re-check

### 6. Scaling Strategy
Per-household sharding; compress recipe text to embeddings for retrieval; rate limit camera uploads; burst compute on Sunday planning peaks

### 7. Failure Modes
Fridge door open ruins scan lighting; duplicate adds from two users—multiplayer merge rules, lighting tips UX

### 8. Observability Considerations
Vision accuracy by category, plan churn, waste proxy trends, cloud vs on-device inference ratio, user correction burden


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Smart Fridge Meal Planner Agent**:

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
