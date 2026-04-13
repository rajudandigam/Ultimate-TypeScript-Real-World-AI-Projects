### 1. System Overview

Shoppers interact with a **chat widget** calling a **Commerce BFF**. **Session store** tracks cart and preferences. **Shopping agent** calls **catalog tools** backed by search indices and **OMS** for inventory. **Checkout** is created via **hosted payment** redirect; no card data touches LLM services.

---

### 2. Architecture Diagram (text-based)

```
Web storefront
        ↓
   Commerce BFF (session)
        ↓
   Shopping Agent
     ↙   ↓   ↘
search  PDP  cart/checkout
        ↓
   Product cards + checkout URL
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, product cards, human handoff to support.
- **LLM layer:** Tool-using shopping agent.
- **Agents (if any):** Single shopper-facing agent.
- **Tools / Integrations:** Search, recommendations, cart, promotions engine, Stripe Checkout.
- **Memory / RAG:** Session prefs; FAQ/policy retrieval; optional signed-in purchase history (consent).
- **Data sources:** Catalog, pricing, inventory, reviews metadata.

---

### 4. Data Flow

1. **Input:** User message + locale + session id; attach cart snapshot hash.
2. **Processing:** Agent issues search with extracted constraints (price band, category).
3. **Tool usage:** Fetch product details; verify stock; propose add-to-cart with server validation.
4. **Output:** Render structured message; on checkout intent, return hosted checkout URL from payment tool.

---

### 5. Agent Interaction (if applicable)

Single agent. **Human support** receives structured handoff with last tool results.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; scale search replicas; cache hot PDP snippets for agent context caps.
- **Caching:** Query result caches with short TTL; CDN for product media.
- **Async processing:** Personalization feature recomputation offline.

---

### 7. Failure Handling

- **Retries:** Search retries; checkout creation retries with idempotency keys.
- **Fallbacks:** Keyword-only search if vector path unhealthy.
- **Validation:** Server rejects cart mutations violating inventory reservations or max qty rules.

---

### 8. Observability

- **Logging:** Tool latency, checkout creation outcomes, search filters used (aggregated).
- **Tracing:** Trace `session_id` through BFF and agent (PII minimized).
- **Metrics:** Add-to-cart rate, checkout conversion, zero-result searches, cost per session, moderation blocks.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Shopping Assistant (Conversational Commerce)**:

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
