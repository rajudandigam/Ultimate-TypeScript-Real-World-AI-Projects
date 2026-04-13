### 1. System Overview

The **game simulation** produces a compact **state vector** each tick for NPCs marked as **LLM-driven**. A **decision service** calls the model and returns **validated intents**. **Moderation** runs on any generative text slots. **Telemetry** records decisions for tuning and incident review.

---

### 2. Architecture Diagram (text-based)

```
Game server (authoritative sim)
        ↓
   NPC state serializer
        ↓
   NPC Behavior Agent
        ↓
   Schema validator + moderation
        ↓
   Sim applies intents (animations/abilities)
        ↓
   Clients receive replicated outcomes
```

---

### 3. Core Components

- **UI / API Layer:** Designer tuning UI, liveops dashboards.
- **LLM layer:** NPC agent with tool calls for world queries.
- **Agents (if any):** One agent instance per eligible NPC (pooled budgets).
- **Tools / Integrations:** State query API, bark library, analytics.
- **Memory / RAG:** Encounter memory store; optional lore retrieval for writers’ tools (offline).
- **Data sources:** Game ECS, designer tables, match config.

---

### 4. Data Flow

1. **Input:** Serialize visible facts + designer constraints + player stimuli hashes.
2. **Processing:** Model proposes `Intent` objects referencing enumerated catalogs.
3. **Tool usage:** Optional extra queries for hidden information rules (Fog of War respected server-side).
4. **Output:** Server validates, applies, replicates; logs decision metadata.

---

### 5. Agent Interaction (if applicable)

Primarily single-agent per NPC. Squad coordination can be a lightweight **non-LLM** planner with LLM only for commander barks.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard decision workers by match; cap concurrent LLM NPCs per server.
- **Caching:** Cache decisions for identical state hashes within short TTL.
- **Async processing:** Non-critical flavor generation can trail gameplay slightly (careful UX).

---

### 7. Failure Handling

- **Timeouts:** Immediate fallback to scripted subtree; never stall simulation tick.
- **Fallbacks:** Reduce NPC tier dynamically under load (elite → scripted).
- **Validation:** Reject intents conflicting with quest locks or cooldowns.

---

### 8. Observability

- **Logging:** Intent distributions, moderation outcomes, model latency histograms.
- **Tracing:** Trace `match_id` + `npc_id` through decision pipeline.
- **Metrics:** Player reports per thousand NPC interactions, encounter completion rates, provider error rates.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI NPC Behavior Engine**:

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
