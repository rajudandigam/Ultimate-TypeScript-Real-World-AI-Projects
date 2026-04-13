### 1. System Overview

Inbound messages arrive via **webhook** into an **ingestion normalizer** that extracts structured features without retaining full bodies unless policy allows. A **phishing agent** calls **intel tools** and emits a **schema-valid verdict**. **Policy engine** maps verdicts to actions (log, tag, quarantine). **Audit service** appends immutable events for compliance.

---

### 2. Architecture Diagram (text-based)

```
MTA / messaging webhook
        ↓
   Normalizer + feature extractor
        ↓
   Phishing Agent (tools: URL, DNS, intel)
        ↓
   Verdict schema validator
        ↓
   Policy engine → SIEM / quarantine API
        ↓
   Case store (redacted) + analyst UI
```

---

### 3. Core Components

- **UI / API Layer:** Analyst review, appeals, tenant policy editor.
- **LLM layer:** Classification agent with strict evidence binding.
- **Agents (if any):** Single primary agent; optional isolated parser worker.
- **Tools / Integrations:** URL expanders, reputation feeds, ticketing, SOAR.
- **Memory / RAG:** Closed-case retrieval with access controls.
- **Data sources:** Message metadata, sandbox results, tenant rules.

---

### 4. Data Flow

1. **Input:** Receive raw MIME or vendor JSON; compute hashes and structural features.
2. **Processing:** Run deterministic pre-score; if ambiguous, invoke agent with tool budget.
3. **Tool usage:** Expand URLs, query intel, fetch attachment metadata only.
4. **Output:** Persist verdict + evidence pointers; enqueue notifications; optional auto-action.

---

### 5. Agent Interaction (if applicable)

Single conversational agent for triage narrative; optional **non-LLM** extractor for MIME complexity.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingestion by tenant; scale agent workers independently.
- **Caching:** URL resolution cache with TTL; negative cache for benign domains (careful).
- **Async processing:** Heavy sandbox paths off the hot request path.

---

### 7. Failure Handling

- **Retries:** Webhook ack fast; async deep analysis with DLQ for poison messages.
- **Fallbacks:** Unknown → escalate to human when intel tools fail broadly.
- **Validation:** Reject verdicts missing minimum evidence for “malicious” label.

---

### 8. Observability

- **Logging:** Action outcomes, tool latency, redacted feature summaries.
- **Tracing:** End-to-end trace per `message_id` / `case_id`.
- **Metrics:** Precision proxy via analyst overrides, queue depth, time-to-triage.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Phishing Detection System**:

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
