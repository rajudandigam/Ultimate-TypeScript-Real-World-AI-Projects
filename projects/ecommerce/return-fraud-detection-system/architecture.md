### 1. System Overview

**Event bus** ingests normalized return/refund facts. **Feature pipeline** materializes graph-friendly aggregates. **Scoring workflow** attaches `risk_score`, `reason_codes[]`, and `model_version`. **Case service** routes to queues; **action adapters** place holds only through policy-gated APIs.

---

### 2. Architecture Diagram (text-based)

```
OMS/WMS events → ingest → feature store
        ↓
Scoring workflow → risk artifact
        ↓
Case queues → human actions → OMS updates
        ↘ optional LLM brief (structured facts only)
```

---

### 3. Core Components

- **UI / API Layer:** Investigator console, appeals portal hooks, admin model registry.
- **LLM layer:** Optional brief generator; never sole scorer in v1.
- **Agents (if any):** Optional later; start workflow-only.
- **Tools / Integrations:** Payments, carriers, device intel vendors (contractual).
- **Memory / RAG:** Feature store + policy doc retrieval for staff.
- **Data sources:** Orders, returns, CS transcripts metadata (redacted).

---

### 4. Data Flow

1. **Input:** `return_id` event triggers workflow instance.
2. **Processing:** Join order history, linked accounts, return reasons, timing anomalies.
3. **Tool usage:** Fetch latest tracking; write risk artifact idempotently.
4. **Output:** Route to tiered queue; emit webhooks to CX tools.

---

### 5. Agent Interaction (if applicable)

Optional investigator copilot reads **case packet** JSON only; cannot execute financial actions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by merchant_id; async scoring for peak season.
- **Caching:** Hot customer aggregates with TTL; invalidation on new events.
- **Async processing:** Nightly graph maintenance jobs separate from realtime scoring.

---

### 7. Failure Handling

- **Retries:** Vendor API backoff; never double-hold refunds—use idempotency keys.
- **Fallbacks:** If model unavailable, rules-only tier with conservative thresholds.
- **Validation:** Schema validation on all outbound actions; dual-control for bans.

---

### 8. Observability

- **Logging:** Decision lineage with model + ruleset versions.
- **Tracing:** Event→score→queue latency; stuck workflow detectors.
- **Metrics:** Precision@k on audits, appeal win rate, $ protected vs collateral damage estimates.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Return Fraud Detection System**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
