### 1. System Overview

Clients start a **verification session** with a **session token**. **Mobile/web SDK** captures doc + selfie per policy. **Workflow** orchestrates vendor checks, aggregates **risk scores**, applies **policy rules**, and issues a **signed verification result** consumable by downstream services (e.g., passkeys enrollment, wire transfer).

---

### 2. Architecture Diagram (text-based)

```
Client SDK
        ↓
   Verification API
        ↓
   Identity workflow (Temporal/Inngest)
   ↓     ↓      ↓      ↓
 doc  liveness match  risk
        ↓
   Decision + audit
        ↓
   Webhook to relying party
```

---

### 3. Core Components

- **UI / API Layer:** Capture UX, status polling, support tooling.
- **LLM layer:** Optional localized guidance copy generation from error codes (non-authoritative).
- **Agents (if any):** None on critical path by default.
- **Tools / Integrations:** Identity vendors, device attestation, watchlists, SIEM.
- **Memory / RAG:** Fraud playbooks for analysts (RBAC); not end-user biometrics.
- **Data sources:** User submissions, device telemetry (minimized), third-party risk signals.

---

### 4. Data Flow

1. **Input:** Start session; collect doc images/video per flow type.
2. **Processing:** Run vendor checks in order; aggregate scores; apply policy matrix.
3. **Tool usage:** Internal admin tools for replay (authorized), case export (redacted).
4. **Output:** Signed JWT or opaque token with claims; or rejection with safe codes.

---

### 5. Agent Interaction (if applicable)

Optional **analyst copilot** reads structured case JSON in separate service; never on user hot path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async workers for vendor calls; regional deployments for data residency.
- **Caching:** Vendor result caching keyed by session id only (short TTL); never cross-user cache biometrics.
- **Async processing:** Large uploads and vendor async callbacks.

---

### 7. Failure Handling

- **Retries:** Vendor retries with backoff; user-friendly retry for network failures.
- **Fallbacks:** Alternate flow (different doc type) if primary fails; manual review queue.
- **Validation:** Reject malformed captures early with client-side quality hints to reduce costs.

---

### 8. Observability

- **Logging:** Decision codes, vendor latency, session outcomes (metadata-first).
- **Tracing:** Trace `session_id` across workflow with strict redaction policies.
- **Metrics:** Completion rate, vendor error rate, review queue depth, attack attempt proxies, cost per verification.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Identity Verification System**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
