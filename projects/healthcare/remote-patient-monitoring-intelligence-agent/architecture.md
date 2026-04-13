### 1. System Overview
**Ingest plane** validates device payloads and writes **canonical observations**. **Feature workers** compute windows. **RPM Agent** consumes recent windows + **care plan snapshot** and returns **structured triage objects**.

### 2. Architecture Diagram (text-based)
```
Devices → ingest → TSDB → feature windows → RPM agent
                              ↓
                    escalation workflow → EHR/messaging
```

### 3. Core Components
Device registry, identity service, rules engine (hard stops), agent BFF, on-call roster integration, PHI-safe log redactor

### 4. Data Flow
Vital batch → dedupe by device clock skew → merge with patient context → score severity → suppress duplicates within cooldown → notify with deep link to trend chart

### 5. Agent Interaction
Agent tools are parameterized queries only; cannot change care plan; narratives must reference observation IDs

### 6. Scaling Challenges
Burst traffic from firmware bugs; hot patients with dense streams; multi-tenant noisy neighbor isolation

### 7. Failure Handling
Late data → recompute windows idempotently; agent timeout → fall back to rule-based severity; never page on empty context

### 8. Observability Considerations
End-to-end ingest lag, suppression counts, escalation latency, false alarm rate by device model, GPU/LLM cost per thousand vitals (if used)


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Remote Patient Monitoring Intelligence Agent**:

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
