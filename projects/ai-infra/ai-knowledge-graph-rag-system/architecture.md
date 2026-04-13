### 1. System Overview

**ETL workflows** ingest source systems into **entity and relationship tables**, promoted into a **property graph** with **provenance** properties. **Chunk index** stores document embeddings linked to graph nodes. **Query API** authenticates users and calls **GraphRAG Agent** with **tool policies** (max hops, max nodes). Responses include **citations** to chunk ids and **edge ids**.

---

### 2. Architecture Diagram (text-based)

```
Source systems → ETL (Temporal)
        ↓
   Graph DB + vector chunk index
        ↓
   GraphRAG Agent
     ↙     ↘
graph traverse   vector retrieve
        ↓
   Answer composer (grounded)
```

---

### 3. Core Components

- **UI / API Layer:** Question answering UI, graph explorer, ontology admin.
- **LLM layer:** Tool-using agent with traversal budgets.
- **Agents (if any):** Primary analyst agent; optional offline extractor services.
- **Tools / Integrations:** Graph query API (sandboxed), vector search, document store.
- **Memory / RAG:** Session entity pins; retrieval over docs and graph summaries.
- **Data sources:** CRM, tickets, wikis, logs (permissioned).

---

### 4. Data Flow

1. **Input:** User question; resolve tenant and entitlements; attach allowed entity types.
2. **Processing:** Agent plans traversals; executes bounded queries; retrieves supporting chunks.
3. **Tool usage:** Each tool returns JSON with ids; model composes explanation referencing ids only.
4. **Output:** Render answer + “evidence” drawer with links to source systems where permitted.

---

### 5. Agent Interaction (if applicable)

Single user-facing agent. **Graph maintenance** is non-conversational batch jobs.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Read replicas for graph; sharding by tenant; separate vector search cluster; cache hot subgraph summaries.
- **Caching:** Memoize frequent traversals with short TTL; negative cache for missing entities.
- **Async processing:** Heavy ETL and re-embedding off interactive path.

---

### 7. Failure Handling

- **Timeouts:** Hard caps on traversal time and node counts; return partial evidence set explicitly.
- **Fallbacks:** Vector-only mode if graph unhealthy (flagged).
- **Validation:** Reject queries expanding across disallowed relationship types.

---

### 8. Observability

- **Logging:** Traversal stats, tool errors, policy denials (minimal PII).
- **Tracing:** Trace `question_id` across graph and vector calls.
- **Metrics:** p95 answer latency, nodes touched distribution, zero-evidence rate, ETL freshness lag, cost per question.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Knowledge Graph + RAG System**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres + pgvector with ACL-aware retrieval + citation payloads.
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
