### 1. System Overview

The debugging assistant is a **session-based agent service** that wraps observability APIs behind **templated tools**. Each session stores **evidence objects** (query + truncated results + timestamps) separate from model prose. The UI renders both: narrative for humans, evidence for verification.

---

### 2. Architecture Diagram (text-based)

```
Engineer UI / IDE
        ↓
   Debugging API (SSO + scopes)
        ↓
   Debugging Agent
     ↙    ↓    ↘
logs   metrics   traces
     ↘    ↓    ↙
   deploys / flags / recent PRs
        ↓
   Incident memo (structured JSON + Markdown)
```

---

### 3. Core Components

- **UI / API Layer:** Chat or structured incident pane; optional VS Code webview host.
- **LLM layer:** Tool loop with iteration caps and refusal behaviors on missing data.
- **Agents (if any):** Single investigator agent in v1.
- **Tools / Integrations:** Loki-like logs, Prometheus-like metrics, Tempo-like traces, CI/CD metadata.
- **Memory / RAG:** Prior incidents and service README/runbooks retrieval.
- **Data sources:** Live telemetry only within approved time windows; no arbitrary internet fetches.

---

### 4. Data Flow

1. **Input:** User provides symptom + scope; system resolves service ownership and allowed backends.
2. **Processing:** Agent selects initial queries from templates; executes via server-side tool implementations.
3. **Tool usage:** Results normalized into evidence objects; model updates hypotheses with citations to evidence ids.
4. **Output:** Persist memo; optionally open Jira draft with embedded queries.

---

### 5. Agent Interaction (if multi-agent)

Single agent. If adding remediation, isolate it as a **different principal** with different tools and explicit human approval transitions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; push heavy queries to worker queue per session.
- **Caching:** Short TTL cache for repeated identical queries during a session.
- **Async processing:** Long log pulls run async with partial updates streamed to UI.

---

### 7. Failure Handling

- **Retries:** Safe retries on 5xx; no blind doubling of expensive queries.
- **Fallbacks:** If a backend is down, produce partial memo with explicit gaps.
- **Validation:** Server rejects queries missing time bounds or required label filters.

---

### 8. Observability

- **Logging:** Log tool latency and row counts; avoid storing raw secrets.
- **Tracing:** Dogfood OTel: trace each tool invocation with `session_id`.
- **Metrics:** Loop count distribution, human thumbs, query cost estimates per session.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Debugging Assistant**:

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
