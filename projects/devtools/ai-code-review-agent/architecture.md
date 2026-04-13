### 1. System Overview

The AI Code Review Agent is a **webhook-driven TypeScript service** that builds a bounded **PR context bundle** (diff, related files, CI signals), runs a **tool-using LLM** with schema-constrained outputs, and publishes **deduplicated** findings to the code host. Optional **RAG** retrieves only from corpora your org allows (docs, ADRs), never from arbitrary web code.

---

### 2. Architecture Diagram (text-based)

```
GitHub App (webhooks)
        ↓
   API / Worker (Node.ts)
        ↓
   PR Context Builder  →  Blob/Git API  +  CI Artifacts API
        ↓
   Review Agent (LLM + tools)
     ↙   ↓   ↘
get_file  search_repo  get_ci_logs
        ↓
   Optional: Vector retrieval (pgvector) — ACL filtered
        ↓
   Validator + Severity calibrator
        ↓
   GitHub Checks / Review Comments API
```

---

### 3. Core Components

- **UI / API Layer:** Webhook ingress (signed), admin API for re-run and policy toggles, optional Next.js dashboard.
- **LLM Layer:** Single agent with structured finding schema; temperature low for factual tasks.
- **Agents (if any):** One primary agent; optional future specialized sub-loops behind same orchestrator.
- **Tools / Integrations:** GitHub/Octokit, CI log fetchers, repo search with path constraints, optional static analyzers invoked as tools.
- **Memory / RAG:** Embeddings index per repo or per service subtree; metadata filters for team and path.
- **Data sources:** PR payloads, git objects, CI outputs, internal markdown/docs corpora.

---

### 4. Data Flow

1. **Input:** Validate webhook signature; extract `repo`, `pr`, `base/head` SHAs; enqueue job with idempotency key `(repo, head_sha, policy_version)`.
2. **Processing:** Fetch diff and file tree; build context windows; run optional retrieval; invoke agent with tool loop budget.
3. **Tool usage:** Model requests files or logs; worker executes with timeouts; results appended to thread state.
4. **Output:** Validate JSON against schema; map to check run or review; store run record for diffing against prior comments to avoid spam.

---

### 5. Agent Interaction (if multi-agent)

This blueprint is **single-agent first**. If you add specialists later, use a **lightweight coordinator** that merges structured finding lists and enforces a single **severity policy**—avoid unconstrained agent-to-agent chat.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless workers behind a queue (SQS, BullMQ, Cloud Tasks); shard by `installation_id`.
- **Caching:** ETag-aware file fetches; cache diff parsing; cache embeddings for unchanged blobs keyed by `blob_sha`.
- **Async processing:** Always respond to webhooks quickly (202); post results asynchronously via check runs.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on 5xx/secondary rate limits; never retry POST comments without idempotency keys.
- **Fallbacks:** If LLM fails, emit “degraded: rules-only” comment or skip with logged reason.
- **Validation:** Schema validation on model output; reject findings that lack line anchors or cite binary/generated paths.

---

### 8. Observability

- **Logging:** JSON logs with `pr_number`, `head_sha`, `run_id`; no raw code in logs unless explicitly allowed.
- **Tracing:** OpenTelemetry spans around each tool call and GitHub API request.
- **Metrics:** Latency histograms, token usage, tool error ratio, human dismissal rate, findings-per-PR distribution.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Code Review Agent**:

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


### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
