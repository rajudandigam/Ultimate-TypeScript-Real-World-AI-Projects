### 1. System Overview

**Ingest service** accepts SBOM/lockfile artifacts keyed by `repo@sha`. **Normalizer** builds a canonical dependency graph for **pnpm workspaces**. **Matcher** queries advisory databases and attaches metadata. **Workflow** dedupes, scores, routes tickets, and schedules **escalations** on SLA breaches.

---

### 2. Architecture Diagram (text-based)

```
CI → artifact store → matcher (OSV/advisories)
        ↓
Findings workflow → tracker + notifications
        ↘ optional LLM digest writer
```

---

### 3. Core Components

- **UI / API Layer:** Findings explorer, suppression workflow UI, policy editor.
- **LLM layer:** Optional summarization only.
- **Agents (if any):** Optional future patch-bot agent in sandbox.
- **Tools / Integrations:** OSV API, GitHub APIs, Slack, ITSM.
- **Memory / RAG:** Policy docs retrieval for engineers.
- **Data sources:** Lockfiles, SBOM JSON, EPSS feeds (optional).

---

### 4. Data Flow

1. **Input:** CI posts CycloneDX + lockfile hash after merge to default branch.
2. **Processing:** Compute new/changed packages vs prior scan artifact.
3. **Tool usage:** Query advisories; enrich with reachability flags from static graph.
4. **Output:** Upsert findings rows; open/update tickets with stable external keys.

---

### 5. Agent Interaction (if applicable)

Core path is workflow-only; optional LLM isolated behind feature flag.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition scans by org; prioritize default branches.
- **Caching:** Advisory responses by `(package, version)` tuple; negative caching.
- **Async processing:** Large graphs processed in chunked jobs with checkpoints.

---

### 7. Failure Handling

- **Retries:** Transient API errors; circuit breakers to mirrors.
- **Fallbacks:** Mark findings as stale-uncertain rather than silent drop.
- **Validation:** Schema-check SBOM; reject partial uploads missing workspace roots.

---

### 8. Observability

- **Logging:** Scan durations, match counts, suppression decisions with actor ids.
- **Tracing:** CI upload → match → ticket spans.
- **Metrics:** MTTR for criticals, duplicate ticket rate, scanner error ratio.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Dependency Security Auditor**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
