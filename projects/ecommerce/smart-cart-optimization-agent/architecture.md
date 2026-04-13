### 1. System Overview

**Checkout BFF** authenticates shoppers and proxies **cart tools** to a **Smart Cart Agent**. **Rule service** encodes merchant constraints. **Telemetry pipeline** records impressions, accepts, and dismissals for offline evaluation and bandits.

---

### 2. Architecture Diagram (text-based)

```
Storefront → Checkout BFF → Cart Agent
                 ↓
        tools: cart, catalog, rules, ship estimator
                 ↓
        Suggestions JSON → UI
```

---

### 3. Core Components

- **UI / API Layer:** Cart drawer component, feature flags, analytics beacons.
- **LLM layer:** Single tool-using agent with schema-validated outputs.
- **Agents (if any):** One agent.
- **Tools / Integrations:** Cart API, search, inventory, shipping estimator, promo read APIs.
- **Memory / RAG:** Optional playbook retrieval for tone; session store for dismissals.
- **Data sources:** PIM, OMS, carrier APIs.

---

### 4. Data Flow

1. **Input:** Cart id or session token + locale + channel.
2. **Processing:** Agent fetches cart snapshot; queries candidate SKUs via search tool.
3. **Tool usage:** Evaluate each candidate against rules; discard blocked items before user display.
4. **Output:** Render suggestions; record outcomes asynchronously.

---

### 5. Agent Interaction (if applicable)

Single agent. **Payment** and **discount application** stay in PCI-scoped services without LLM involvement.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF autoscale; isolate hot merchants.
- **Caching:** Adjacency lists for top sellers; CDN for product metadata snapshots.
- **Async processing:** Nightly jobs refresh embeddings or co-purchase stats.

---

### 7. Failure Handling

- **Retries:** Tool retries with jitter; cap LLM turns per session.
- **Fallbacks:** Hide agent UI on repeated failures; show static bundles.
- **Validation:** Server-side revalidation of suggested SKUs against latest cart version.

---

### 8. Observability

- **Logging:** Structured suggestion events with experiment bucket ids.
- **Tracing:** Breakdown cart fetch vs LLM vs search latencies.
- **Metrics:** Attach rate, incremental revenue per 1k sessions, error budgets.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Smart Cart Optimization Agent**:

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
