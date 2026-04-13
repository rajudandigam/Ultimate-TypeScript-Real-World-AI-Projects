### 1. System Overview

The engine sits on the **request path** as middleware or sidecar: **normalize** payload → **evaluate rules** (OPA/CEL) → optional **classifier** → **decision** → forward or block. Policy definitions are **git-versioned** artifacts loaded into memory with hot reload and audit trails.

---

### 2. Architecture Diagram (text-based)

```
Client → LLM app
        ↓
   Guardrail sidecar / SDK hook
   ├─ Schema + regex (fast)
   ├─ OPA policies (deterministic)
   ├─ Classifier model (optional)
   └─ Escalation / masking actions
        ↓
   Allow / mask / block → downstream model or client error
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor UI, simulation console, audit search for security.
- **LLM layer:** Optional classifier models; separate from business LLM.
- **Agents (if any):** None on critical path by default.
- **Tools / Integrations:** Ticketing, SIEM, URL scanners (allowlisted).
- **Memory / RAG:** Policy text retrieval for explainability to admins.
- **Data sources:** Published policy bundles, red-team test suites, org risk tiers.

---

### 4. Data Flow

1. **Input:** Intercept request/response; attach `policy_version`, `tenant_id`, `surface`.
2. **Processing:** Run compiled rule graph; short-circuit on hard blocks; optionally call classifier with timeout.
3. **Tool usage:** On escalate, open ticket with hashed excerpt references—not raw secrets.
4. **Output:** Return decision + optional masked text; emit OTel span with decision tags.

---

### 5. Agent Interaction (if applicable)

Classifier is a **model service**, not a conversational agent. Optional “explainer” runs **offline** for admins.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless sidecars; local policy cache; regional policy CDNs for read-heavy configs.
- **Caching:** Compiled policy artifacts; embedding cache for policy clauses (admin-only).
- **Async processing:** Heavy red-team replay jobs offline.

---

### 7. Failure Handling

- **Retries:** Classifier transient errors → fail according to configured posture (closed/open).
- **Fallbacks:** Degrade to rules-only if classifier unhealthy (explicit metric).
- **Validation:** Reject policy bundles failing CI signature or schema.

---

### 8. Observability

- **Logging:** Decision codes, policy version, latency per stage; PII-aware redaction.
- **Tracing:** Child spans for each policy stage under request span.
- **Metrics:** Block/mask/allow rates, classifier timeout rate, appeals overturn rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Guardrails & Safety Engine**:

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
