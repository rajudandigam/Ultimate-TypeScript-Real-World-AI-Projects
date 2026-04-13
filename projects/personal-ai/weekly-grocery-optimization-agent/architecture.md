### 1. System Overview
**Pantry service** stores items with qty and expiry confidence. **Agent** emits **meal plan + grocery list** artifacts versioned per week. **Merge service** dedupes and applies hard dietary blocks.

### 2. Architecture Diagram (text-based)
```
Inputs → pantry store → grocery agent → list artifact
                              ↓
                    store adapters / share export
```

### 3. Core Components
OCR pipeline (async), recipe DB, offer ingestor, optimizer (MILP-lite or heuristics in TS), notification scheduler, household RBAC

### 4. Data Flow
Snapshot pantry → propose meals → expand to ingredients → subtract on-hand → rank optional add-ons by deals → export

### 5. Agent Interaction
Tool calls return structured rows; agent cannot invent SKUs; final list diff-reviewed by optional second “safety checker” prompt for allergens only

### 6. Scaling Considerations
Many households per account; heavy OCR offloaded to queue; cache store flyers by ZIP; compress repeated staples

### 7. Failure Scenarios
Offer feed stale → label prices unverified; vision wrong item → user correction loop updates embeddings; optimizer infeasible → relax one soft goal with explanation

### 8. Observability Considerations
OCR correction rate, deal attach precision, weekly job success, cart deep link click-through, $ estimate error distribution


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Weekly Grocery Optimization Agent**:

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
