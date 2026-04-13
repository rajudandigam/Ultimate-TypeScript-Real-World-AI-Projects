### 1. System Overview

**Connectors** pull raw artifacts into a **landing zone**, then **normalizers** map to a canonical schema. **Deduplication** merges identities across feeds. **Indexer** maintains keyword + vector fields. **Analysis API** hosts the **CTI agent** that queries search/graph tools. **Briefing scheduler** produces recurring digests with citations.

---

### 2. Architecture Diagram (text-based)

```
Feeds (STIX/RSS/API)
        ↓
   Connector workers → landing store
        ↓
   Normalize + dedupe → canonical graph (Postgres)
        ↓
   Indexer → OpenSearch
        ↓
   CTI Agent (tools: search, timeline, metrics)
        ↓
   UI / webhooks / exports (STIX)
```

---

### 3. Core Components

- **UI / API Layer:** Search, investigations, connector admin, RBAC.
- **LLM layer:** Grounded analysis agent.
- **Agents (if any):** Primary analyst agent.
- **Tools / Integrations:** SIEM, ticketing, messaging webhooks.
- **Memory / RAG:** Investigation notes linked to entities.
- **Data sources:** Licensed feeds, internal incident exports (governed).

---

### 4. Data Flow

1. **Input:** Scheduled connector runs ingest new documents and IOCs.
2. **Processing:** Normalize, score confidence, set TTLs, update graph edges.
3. **Tool usage:** Analyst asks a question; agent runs constrained searches and aggregates.
4. **Output:** Render answer with citations; optionally open SOAR case with attached evidence IDs.

---

### 5. Agent Interaction (if applicable)

Single agent for Q&A. Background jobs may call LLM for clustering labels with human review queues.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard connectors by tenant; separate search replicas for read-heavy workloads.
- **Caching:** Hot entity pages; precomputed “top rising techniques” rollups.
- **Async processing:** Heavy clustering offline; interactive path stays low-latency.

---

### 7. Failure Handling

- **Retries:** Connector retries with checkpointing; poison message isolation.
- **Fallbacks:** Degraded search (keyword-only) if vector index unhealthy.
- **Validation:** Reject exports that include expired IOCs without explicit override.

---

### 8. Observability

- **Logging:** Connector outcomes, normalization errors, export actions.
- **Tracing:** Trace agent tool chains per `investigation_id`.
- **Metrics:** Ingest lag, dedupe rate, citation coverage, override rate by analysts.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Threat Intelligence Aggregator**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Agent runtime (OpenAI Agents SDK or LangGraph) coordinating tools; deterministic validators after each tool batch.
- **Tool execution layer:** Adapter modules per external system; timeouts, retries, and circuit breakers; never call vendors directly from UI.
- **Memory / retrieval layer:** Postgres + pgvector with ACL-aware retrieval + citation payloads.
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
