### 1. System Overview

Content events enter an **ingress API** normalized to **cases**. **Workflow** stages: **hash/block → deterministic models → optional LLM edge → human queue → action → appeal**. Actions update product state and notify users per policy. **Evidence store** references media with strict retention rules.

---

### 2. Architecture Diagram (text-based)

```
UGC event stream
        ↓
   Moderation workflow
 ↓   ↓    ↓     ↓
hash ML   LLM  human
classifiers agent review
        ↓
   Action executor (hide/ban/escalate)
        ↓
   Audit + appeals
```

---

### 3. Core Components

- **UI / API Layer:** Moderator console, appeals, policy admin, transparency center (as allowed).
- **LLM layer:** Borderline-case agent with policy retrieval tools.
- **Agents (if any):** Single adjudication agent per case (session scoped).
- **Tools / Integrations:** Vendor classifiers, ticketing, user notification, law enforcement workflows (region-specific).
- **Memory / RAG:** Policy corpora with versioning; redacted precedent retrieval.
- **Data sources:** User text/media metadata, reputation signals (governed).

---

### 4. Data Flow

1. **Input:** Receive content payload references; virus scan; generate perceptual hashes where applicable.
2. **Processing:** Run ordered defenses; short-circuit on high-confidence severe hits with mandatory escalation paths.
3. **Tool usage:** Agent may fetch policy chunks and similar anonymized cases; cannot directly publish public sanctions without workflow completion.
4. **Output:** Persist label + confidence + reasons; enqueue notifications and appeals workflow.

---

### 5. Agent Interaction (if applicable)

Single agent per case. **Human reviewers** override with structured reason codes feeding training pipelines.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition queues by locale/content type; autoscale GPU workers for media classifiers separately from LLM tier.
- **Caching:** Policy chunk caches; negative caches for known benign hashes (careful poisoning defenses).
- **Async processing:** Video/audio transcription and scanning off hot path with priority lanes.

---

### 7. Failure Handling

- **Retries:** Vendor retries with backoff; never drop CSAM pathway events—use dedicated highest-priority queue.
- **Fallbacks:** Route to human if automation unhealthy; show “under review” states to users where product-appropriate.
- **Validation:** Schema validation on decisions; dual control for account-level bans if configured.

---

### 8. Observability

- **Logging:** Stage outcomes, SLA timers, appeal resolutions (metadata-first).
- **Tracing:** Trace `case_id` across workflow and vendor calls (strict redaction).
- **Metrics:** Precision proxies via audits, queue age percentiles, false positive reports, vendor latency, moderator throughput.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Content Moderation Engine**:

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
