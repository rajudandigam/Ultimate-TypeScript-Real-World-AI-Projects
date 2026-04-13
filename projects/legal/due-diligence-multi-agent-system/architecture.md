### 1. System Overview
**VDR connector** lands files with labels. **Indexer** stores chunks with **document-level ACLs**. **Supervisor** assigns tasks to domain agents and merges **typed finding records** (severity, evidence spans, owner).

### 2. Architecture Diagram (text-based)
```
VDR → index (ACL) → financial / legal / tech agents
                           ↓
                    synthesizer → memo → review queue
```

### 3. Core Components
Search (hybrid), OCR workers, entity linker, citation validator, RBAC, audit log immutable store, export service

### 4. Data Flow
New upload event → enqueue reindex → agents pull scoped queries only → findings deduped by fingerprint → supervisor compiles narrative sections

### 5. Agent Interaction
Agents cannot see whole dataroom—queries scoped by folder tags; synthesizer only sees structured finding JSON + allowed excerpts

### 6. Scaling Challenges
Terabyte rooms; PDFs with scanned tables; concurrent deals; expensive reranking—tiered processing and caching

### 7. Failure Handling
Partial index → mark coverage gaps explicitly; conflicting agent conclusions → surface as “needs human reconciliation”

### 8. Observability Considerations
Pages indexed per hour, query latency, finding throughput, human edit distance on final memos, access denied events (expected vs bug)


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Due Diligence Multi-Agent System**:

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


### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
