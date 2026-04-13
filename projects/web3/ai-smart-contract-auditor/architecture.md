### 1. System Overview

A **scan orchestrator** enqueues jobs per repo commit. Each job runs in an **isolated worker** executing static analyzers and tests, capturing **machine-readable outputs**. An **auditor agent** consumes outputs and emits **structured findings** with citations. A **governance layer** controls disclosure, ignore rules, and severity overrides.

---

### 2. Architecture Diagram (text-based)

```
CI / upload webhook
        ↓
   Scan orchestrator → job queue
        ↓
   Sandbox worker (Slither, tests, SBOM)
        ↓
   Artifact store (logs, SARIF-like JSON)
        ↓
   Auditor Agent (read-only tools)
        ↓
   Findings DB + PR comment / dashboard
```

---

### 3. Core Components

- **UI / API Layer:** Upload/CI config, triage console, waiver workflow.
- **LLM layer:** Synthesis agent with strict citation rules.
- **Agents (if any):** Single auditor agent.
- **Tools / Integrations:** Static analyzers, test runners, SCM webhooks.
- **Memory / RAG:** Optional private corpus retrieval with licensing controls.
- **Data sources:** Source trees, build artifacts, dependency manifests.

---

### 4. Data Flow

1. **Input:** Receive repo ref; fetch source in sandbox; compute lockfile hash.
2. **Processing:** Run analyzers with timeouts; collect stdout/stderr as artifacts.
3. **Tool usage:** Agent queries artifacts; may request additional targeted scans (bounded).
4. **Output:** Persist findings; notify CI; block merge only if policy says so.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional split: **runner** (no LLM) vs **writer** (LLM) communicating via files only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Autoscale sandbox workers; separate GPU/CPU pools if needed.
- **Caching:** Cache analysis results keyed by `(commit, tool_versions, lockfile_hash)`.
- **Async processing:** Long fuzz jobs as lower-priority queues.

---

### 7. Failure Handling

- **Timeouts:** Hard caps per stage; partial reports labeled incomplete.
- **Fallbacks:** If LLM unavailable, ship raw tool output to UI.
- **Validation:** Schema validation on findings; reject uncited critical claims.

---

### 8. Observability

- **Logging:** Job durations, tool exit codes, resource usage, scan outcomes.
- **Tracing:** Trace `job_id` across queue, sandbox, agent.
- **Metrics:** Findings per KLOC, false positive rate from human labels, sandbox failure rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Smart Contract Auditor**:

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
