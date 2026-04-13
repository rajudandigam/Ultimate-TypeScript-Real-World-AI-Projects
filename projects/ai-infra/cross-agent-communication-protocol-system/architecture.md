### 1. System Overview

The protocol defines **envelope schemas** and **authorization tokens**. A **broker cluster** stores and forwards messages with durability settings per topic. **SDKs** in TypeScript wrap serialization, retries, and trace propagation. **Policy service** evaluates each publish/subscribe against RBAC and tenant boundaries.

---

### 2. Architecture Diagram (text-based)

```
Agent A (SDK) --publish--> Broker (durable log)
                              ↓
                         Policy service (allow/deny)
                              ↓
Agent B (SDK) <--deliver-- consumer group
        ↓
   reply envelope (optional RPC)
```

---

### 3. Core Components

- **UI / API Layer:** Admin console for ACLs, topic lifecycle, replay controls.
- **LLM layer:** None in broker path.
- **Agents (if any):** External clients using SDK.
- **Tools / Integrations:** Identity provider, KMS, SIEM exporters.
- **Memory / RAG:** Optional retained store with TTL; not a general-purpose chat log.
- **Data sources:** ACL tables, schema registry, consumer offset metadata.

---

### 4. Data Flow

1. **Input:** Agent publishes envelope with `tenant_id`, `capability_token`, `schema_version`, `payload_ref`.
2. **Processing:** Broker authenticates; policy engine evaluates; serialize to partition key; append log.
3. **Tool usage:** Consumers ack/process; on failure, redeliver until DLQ threshold; replay tool for support with audit.
4. **Output:** Delivery to subscribers; metrics updated; traces linked via `correlation_id`.

---

### 5. Agent Interaction (if applicable)

Agents interact **only** through the protocol. Supervisors can enforce **allowed graph edges** by issuing capability tokens scoped to pairs `(producer_role, consumer_role)`.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by tenant or topic; separate control plane; read replicas for ACL lookups.
- **Caching:** Schema registry cache; negative cache for denied publishers (short TTL, careful abuse handling).
- **Async processing:** Compaction jobs for old partitions; async DLQ triage workflows.

---

### 7. Failure Handling

- **Retries:** Consumer-controlled redelivery; broker-level redelivery limits; idempotent handlers required by contract.
- **Fallbacks:** Secondary region failover with fenced writes and documented RPO/RTO.
- **Validation:** Reject unknown schema versions; quarantine oversized payloads.

---

### 8. Observability

- **Logging:** AuthZ decisions, delivery latency, DLQ reasons (metadata only).
- **Tracing:** Inject trace context on publish; continue on consume; measure cross-agent hop latency.
- **Metrics:** Publish rate, consumer lag, schema mismatch count, token verification failures.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Cross-Agent Communication Protocol System**:

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
