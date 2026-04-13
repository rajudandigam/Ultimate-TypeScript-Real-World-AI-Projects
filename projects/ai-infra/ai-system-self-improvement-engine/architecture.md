### 1. System Overview

A **supervisor workflow** schedules analysis windows, launches **specialist agents** in parallel, merges their **typed proposals**, runs **shadow evals** when possible, and opens **human approval** tasks for risky diffs. Promotion happens only through **git + CI** or controlled **feature flag** canaries with automated rollback hooks.

---

### 2. Architecture Diagram (text-based)

```
Signals (SLO / eval / incidents)
        ↓
   Improvement Supervisor
     ↙      ↓      ↘
Quality   Cost   Reliability
 Agent     Agent   Agent
        ↓
   Proposal merge + conflict check
        ↓
   Shadow eval / canary plan
        ↓
   Human approval (optional) → PR / flag change
        ↓
   Post-verify tasks → audit archive
```

---

### 3. Core Components

- **UI / API Layer:** Approval inbox, proposal diff viewer, kill switch console.
- **LLM layer:** Specialist agents with narrow tools; supervisor orchestrates budgets.
- **Agents (if any):** Quality, cost, reliability specialists + supervisor merge logic.
- **Tools / Integrations:** Metrics warehouse, trace store, git, CI, feature flags, ITSM.
- **Memory / RAG:** Historical proposals and outcomes for retrieval-augmented planning.
- **Data sources:** OTel-derived rollups, eval dashboards, incident timelines (redacted).

---

### 4. Data Flow

1. **Input:** Trigger fires with scope (`service`, `window`, `risk_tier`).
2. **Processing:** Specialists query allowed datasets; emit `Proposal[]` with evidence links.
3. **Tool usage:** Supervisor validates merges; runs shadow eval job or attaches existing results; opens PR with linked metrics snapshot.
4. **Output:** Await human/CI merge; deploy canary; run post-verify; archive run bundle.

---

### 5. Agent Interaction (if applicable)

**Roles:** Specialists explore different objective functions; supervisor prevents contradictory edits (e.g., cost cut that breaks safety prompt). **Communication:** via structured proposal bus, not chat. **Orchestration:** deadlines, max rounds, explicit deny reasons returned to specialists.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition improvement jobs by service/tenant; isolate heavy eval shards.
- **Caching:** Cache repeated metric queries within a window; reuse eval artifacts across similar proposals.
- **Async processing:** All improvement cycles async; never block online traffic.

---

### 7. Failure Handling

- **Retries:** Data query retries; cancel proposal if evidence incomplete.
- **Fallbacks:** Produce human-readable report only if automation cannot safely propose code changes.
- **Validation:** Schema validation for proposals; reject edits touching deny-listed paths.

---

### 8. Observability

- **Logging:** Proposal ids, merged diff hash, CI run ids, canary stage outcomes.
- **Tracing:** Trace each specialist and eval job under `improvement_run_id`.
- **Metrics:** Merge rate, revert rate, median delta on target KPIs, human override rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI System Self-Improvement Engine**:

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
