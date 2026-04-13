### 1. System Overview

The assistant is a **TypeScript API** that orchestrates an LLM **tool loop** over a **query execution service**. The execution service compiles requests into SQL/DSL using **allowlisted metadata**, runs through **RLS-enforced** credentials, enforces **LIMITS** and **timeouts**, and returns truncated results to the model for explanation. All queries are **audited**.

---

### 2. Architecture Diagram (text-based)

```
Analyst UI
        ↓
   Analytics API (SSO + entitlements)
        ↓
   Query Assistant Agent
     ↙     ↓     ↘
describeMetric  proposeQuery  runQuery (wrapped)
        ↓
   SQL validator / EXPLAIN gate
        ↓
   Warehouse (RLS role) → Result sample
        ↓
   Explanation + chart spec → UI
```

---

### 3. Core Components

- **UI / API Layer:** Chat + table/chart view, saved questions, admin policy console.
- **LLM layer:** Agent producing structured query artifacts, not only strings.
- **Agents (if any):** Primary assistant; optional validator micro-loop.
- **Tools / Integrations:** Semantic layer APIs, warehouse drivers, catalog metadata service.
- **Memory / RAG:** Metric glossary, approved query library, dashboard context snippets.
- **Data sources:** Curated tables/views exposed to the assistant principal only.

---

### 4. Data Flow

1. **Input:** User question + scope; resolve allowed datasets and metric versions.
2. **Processing:** Retrieve relevant definitions; propose parameterized SQL AST; validate against allowlist and type rules.
3. **Tool usage:** EXPLAIN + execute with caps; if too expensive, refuse with suggested narrower question.
4. **Output:** Return rows + visualization spec + explanation referencing metric ids; persist audit record.

---

### 5. Agent Interaction (if applicable)

Single-agent default. Validator can be **deterministic** code first; add LLM validator only if it improves measured defect rate.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; isolate heavy queries to dedicated pool; cache metadata aggressively.
- **Caching:** Cache identical validated queries briefly keyed by `(user_scope, normalized_question)`.
- **Async processing:** Large exports as async jobs with signed download links.

---

### 7. Failure Handling

- **Retries:** Transient warehouse errors; cancel long-running queries server-side.
- **Fallbacks:** Offer prebuilt report links if generation fails.
- **Validation:** Reject any query referencing non-allowlisted objects; enforce date window defaults.

---

### 8. Observability

- **Logging:** Query fingerprints, scan stats, policy denials; avoid logging result payloads.
- **Tracing:** Trace tool calls and warehouse execution with `question_id`.
- **Metrics:** Blocked query reasons distribution, median scan bytes, user satisfaction signals.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Analytics Query Assistant**:

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
