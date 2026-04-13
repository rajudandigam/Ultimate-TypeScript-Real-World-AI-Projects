### 1. System Overview

Validation runs as a **CI job** or **webhook** that fetches two contract versions, runs a **deterministic semantic diff engine**, then optionally invokes an **LLM agent** to classify and narrate findings using **only** the diff artifact as primary evidence. The merge gate consumes a **machine-readable** report.

---

### 2. Architecture Diagram (text-based)

```
PR / publish event
        ↓
   Validator service
        ↓
   Spec fetch + parse (swagger-parser)
        ↓
   Semantic diff engine → diff JSON
        ↓
   Contract Review Agent (tools: query diff, fetch guidelines)
        ↓
   Rule engine merge (deterministic overrides)
        ↓
   Check run / annotations / artifact upload
```

---

### 3. Core Components

- **UI / API Layer:** PR checks, optional portal for browsing spec history.
- **LLM layer:** Agent for explanation and severity suggestions constrained by diff IDs.
- **Agents (if any):** Single review agent.
- **Tools / Integrations:** Git provider, artifact storage, optional analytics for endpoint traffic.
- **Memory / RAG:** Internal standards docs; labeled historical PRs.
- **Data sources:** OpenAPI/AsyncAPI YAML/JSON, protobuf-to-OpenAPI exports, gateway configs.

---

### 4. Data Flow

1. **Input:** Receive base and head spec locations; resolve to parsed AST objects.
2. **Processing:** Compute structured diff; dedupe findings; assign stable IDs per change.
3. **Tool usage:** Agent queries diff slices and policy snippets; emits annotated list referencing IDs.
4. **Output:** Merge agent output with deterministic failures; publish unified report JSON + UI summary.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional secondary **security linter** as separate non-LLM rule pack or isolated agent with read-only tools.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless validator workers; parallelize diff by tag/path for huge APIs.
- **Caching:** Memoize parse + diff by content hash; reuse when only metadata changes.
- **Async processing:** Very large specs analyzed async with pending check state.

---

### 7. Failure Handling

- **Retries:** Network fetch retries for remote specs; checksum validation.
- **Fallbacks:** If LLM unavailable, still fail/pass from deterministic rules with minimal template text.
- **Validation:** Reject agent output referencing unknown diff IDs; cap narrative length for UI.

---

### 8. Observability

- **Logging:** Spec hashes, diff counts, model latency; scrub PII-like examples from logs.
- **Tracing:** Span per parse, diff, model call; propagate `pr_number`.
- **Metrics:** False positive/negative rates from reviewer labels, parser error rate, check latency.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI API Contract Validator**:

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


### Security and Permissions Layer
- **RBAC** for who can run which tools or see which tenant data.
- **Audit logs** for tool args (redacted), model IDs, and decisions.
- **Rate limiting** at API edge and per-user for LLM routes.
- **PII redaction** before logging or third-party analytics.
- **Tenant isolation** (row-level security in Postgres or separate schemas) when multi-tenant SaaS is implied.
