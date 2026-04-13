### 1. System Overview

PR Risk Analyzer builds a **feature bundle** from the VCS and CI systems, enriches it with **retrieved historical context**, and runs a **bounded agent** that must attach citations to every high-impact claim. A **calibration layer** (rules + learned weights) produces a merge-queue-friendly score with audit metadata.

---

### 2. Architecture Diagram (text-based)

```
Merge queue / PR webhook
        ↓
   API (auth + policy)
        ↓
   Feature extractor (deterministic)
     ↘        ↙
   Git/CI APIs    Ownership graph
        ↓
   Retrieval (pgvector / search) — incidents + PRs
        ↓
   Risk Agent (LLM + tools: history search, file stats)
        ↓
   Calibrator (rules + versioned weights)
        ↓
   Risk artifact JSON → Gate / UI / Comment
```

---

### 3. Core Components

- **UI / API Layer:** Merge gate HTTP API, dashboard for score lineage, optional GitHub check run publisher.
- **LLM layer:** Agent with tools; structured JSON for factors and citations.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** Git provider, CI checks API, CODEOWNERS parser, dependency metadata service.
- **Memory / RAG:** Embeddings over historical PRs and incidents with strict ACL and service tags.
- **Data sources:** Diff hunks (summarized), test mapping tables, incident database.

---

### 4. Data Flow

1. **Input:** Receive PR identifiers; load policy version for repo.
2. **Processing:** Compute deterministic signals; query retrieval for top-k similar changes; assemble context pack under token budget.
3. **Tool usage:** Agent may request extra file lists or incident details; each response logged.
4. **Output:** Emit `score`, `drivers[]`, `citations[]`, `unknowns[]`; publish to gate or store for async merge.

---

### 5. Agent Interaction (if multi-agent)

Single-agent architecture. Add specialists only if you can show **orthogonal evidence** (e.g., SAST-only agent) and a deterministic merger of factor lists.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless scoring workers; cache git metadata per `head_sha`.
- **Caching:** Reuse feature bundle across retests until `head_sha` changes.
- **Async processing:** For very large repos, async mode with “pending risk” check run updating to final.

---

### 7. Failure Handling

- **Retries:** Git API retries with conditional requests; avoid thundering herds on monorepo.
- **Fallbacks:** If LLM fails, emit deterministic-only score with banner.
- **Validation:** Reject outputs missing citations for severity above threshold.

---

### 8. Observability

- **Logging:** Policy version, feature vector hash, retrieval query ids.
- **Tracing:** Span per tool call; merge-queue latency budgets.
- **Metrics:** Score drift over time, override counts, incident correlation rate post-merge.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **PR Risk Analyzer**:

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
