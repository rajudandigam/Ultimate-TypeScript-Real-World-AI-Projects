### 1. System Overview

**Connectors** land raw rows in a **landing zone**. **Transform engine** applies versioned mapping packs to emit **FHIR bundles**. Rows that fail validation enter an **exception queue**. A **FHIR Mapping Agent** (per steward session) proposes **typed patches** using tools; an **approval service** commits approved packs and triggers **CI regression** on fixtures before promotion.

---

### 2. Architecture Diagram (text-based)

```
Legacy sources → landing zone → transform engine
        ↓
   Validator ($validate)
        ↓
   OK → FHIR store          FAIL → exception queue
                               ↓
                        Mapping Agent (tools)
                               ↓
                     Steward approval → new mapping version
```

---

### 3. Core Components

- **UI / API Layer:** Steward console, connector admin, release promotion UI.
- **LLM layer:** Tool-using agent with strict JSON outputs for mapping edits.
- **Agents (if any):** Single primary agent; optional test-generation agent in sandbox.
- **Tools / Integrations:** FHIR server validate API, terminology server, row fetcher, git-like mapping registry.
- **Memory / RAG:** Vector index over internal IG notes and runbooks (permissioned).
- **Data sources:** HL7 v2 streams, CSV drops, REST pollers.

---

### 4. Data Flow

1. **Input:** Connector ingests batch or incremental updates with cursor checkpoints.
2. **Processing:** Normalize to a canonical row model; apply mapping pack `vN`.
3. **Tool usage:** On failure, agent retrieves validation diagnostics + relevant IG snippets; proposes patch.
4. **Output:** After approval, bump to `vN+1`; replay quarantined rows; archive lineage.

---

### 5. Agent Interaction (if applicable)

Single steward-facing agent per session. **Dual-control** optional: second human for high-risk domains (e.g., medications).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Parallel transform workers per shard key; isolate heavy tenants.
- **Caching:** Terminology expansions; embedded IG chunk caches with ETags.
- **Async processing:** Large batches via object storage + job queue; never hold huge bundles in LLM context.

---

### 7. Failure Handling

- **Retries:** Transient validator/terminology errors with jittered backoff.
- **Fallbacks:** Route to human-only queue if LLM budget exceeded or policy requires.
- **Validation:** Schema-validate agent outputs; deny patches that widen PHI scopes.

---

### 8. Observability

- **Logging:** Counts by `error_code`, mapping version adoption, steward decision latencies.
- **Tracing:** Trace connector → transform → validate for stuck-file diagnosis.
- **Metrics:** Rows/hour, fail rate by source, mean time to clear exceptions, regression test pass rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Health Data Interoperability (FHIR Agent System)**:

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
