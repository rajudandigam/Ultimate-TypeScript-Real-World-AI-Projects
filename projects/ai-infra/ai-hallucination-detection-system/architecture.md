### 1. System Overview

The detector exposes a **Verify API** used by the LLM gateway or post-processor. It loads evidence references, runs **deterministic gates**, then optionally invokes a **verifier agent** with read-only tools. Results are **append-only audit events** consumed by analytics and product UI.

---

### 2. Architecture Diagram (text-based)

```
Draft answer + evidence bundle
        ↓
   Deterministic checks (citations, schema)
        ↓
   Verifier Agent (optional tools: fetchFact, calc)
        ↓
   Adjudicator (rules merge model + deterministic)
        ↓
   Verdict + UI annotations + OTel attrs
```

---

### 3. Core Components

- **UI / API Layer:** Reviewer tooling, threshold tuning, red-team replay console.
- **LLM layer:** Verifier model(s); separate from generator for blast-radius control.
- **Agents (if any):** Single verifier agent loop with strict tool allowlist.
- **Tools / Integrations:** Internal KB, calculator, read-only SQL with guardrails.
- **Memory / RAG:** Evidence chunks passed in by reference; optional calibration retrieval.
- **Data sources:** Retrieval store, tool traces, structured facts tables.

---

### 4. Data Flow

1. **Input:** Receive hashed bundle; validate integrity; reject if evidence missing for required claims policy.
2. **Processing:** Run citation checks; if pass, optionally run verifier with bounded steps.
3. **Tool usage:** Fetch extra snippets or numeric facts; append to evidence list with ids.
4. **Output:** Emit verdict JSON; propagate to client SDK for inline markers; log audit row.

---

### 5. Agent Interaction (if applicable)

Single verifier agent. Numeric/tool checks can be **non-LLM modules** invoked as tools for reliability.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless verifier fleet; cache evidence snippets by id for hot paths.
- **Caching:** Verdict cache keyed by `(answer_hash, evidence_hash, policy_version)` with short TTL where safe.
- **Async processing:** Async verification for low-risk surfaces; sync only where UX demands.

---

### 7. Failure Handling

- **Retries:** Limited retries on model timeouts; downgrade verdict with explicit uncertainty.
- **Fallbacks:** If verifier unavailable, apply stricter citation-only mode.
- **Validation:** Reject tool outputs not matching schema before feeding back to model.

---

### 8. Observability

- **Logging:** Verdict codes, latency breakdown, tool success flags.
- **Tracing:** Child span `verify` under user request span with linkage to retrieval index version.
- **Metrics:** Unsupported rate spikes, contradiction counts, human override rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Hallucination Detection System**:

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
