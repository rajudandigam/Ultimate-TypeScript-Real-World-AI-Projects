### 1. System Overview

Feedback events land in an **ingest API**, pass **consent + DLP** gates, and enqueue **curation workflows**. Batch jobs **dedupe**, **cluster**, and **package exports**. An **agent worker** proposes actions (PRs, tickets) via tools; **human approval** services gate mutations.

---

### 2. Architecture Diagram (text-based)

```
Clients / support webhooks
        ↓
   Feedback ingest API
        ↓
   Consent + DLP workflow
        ↓
   Dedupe + cluster jobs
        ↓
   Curation Agent (optional) → PR / ticket tools
        ↓
   Human approval service
        ↓
   Dataset export store (immutable manifests)
```

---

### 3. Core Components

- **UI / API Layer:** Feedback widgets, reviewer workbench, admin policy console.
- **LLM layer:** Clustering and summarization agent in offline workers.
- **Agents (if any):** Curation agent with write tools only after approval tokens attached.
- **Tools / Integrations:** Git, ticketing, Slack, object storage, training pipeline APIs.
- **Memory / RAG:** Embeddings for dedupe; retrieval of similar historical clusters.
- **Data sources:** Redacted transcripts, trace ids, rubric labels, moderator notes.

---

### 4. Data Flow

1. **Input:** Authenticate source; attach `trace_id`, `user_consent`, `product_surface`.
2. **Processing:** Validate schema; quarantine if DLP fails; enqueue for dedupe fingerprinting.
3. **Tool usage:** After human batch approval, export tool writes versioned JSONL + manifest checksum.
4. **Output:** Notify downstream training job or prompt repo PR with linked feedback ids.

---

### 5. Agent Interaction (if applicable)

Agent is **offline** and **tool-gated**. No autonomous training; proposals are artifacts for humans.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingest by tenant; autoscale clustering workers separately from API.
- **Caching:** Bloom filters / minhash for dedupe; cache cluster centroids cautiously with TTL.
- **Async processing:** All heavy steps async; priority queues for high-severity feedback.

---

### 7. Failure Handling

- **Retries:** Transient storage errors; not for consent failures without human override.
- **Fallbacks:** Manual CSV export path if automation degraded.
- **Validation:** Manifest verification on byte counts and checksums before marking export complete.

---

### 8. Observability

- **Logging:** Ingest counts, quarantine reasons, approval latencies (no raw PII).
- **Tracing:** Trace workflows end-to-end with `feedback_batch_id`.
- **Metrics:** Export success rate, cluster stability over time, reviewer throughput.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Feedback Loop System (Human-in-the-loop)**:

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
