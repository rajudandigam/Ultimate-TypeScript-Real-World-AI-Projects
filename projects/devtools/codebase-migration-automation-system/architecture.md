### 1. System Overview

**Migration controller** reads a **manifest** and builds a **dependency wave graph**. **Workflow engine** executes waves: apply codemod → open/update PR → wait for required checks → merge or hold. **State DB** tracks per-package status and rollback pointers.

---

### 2. Architecture Diagram (text-based)

```
Manifest → wave planner → per-package workflows
        ↓
Codemod runner → PR → CI gates → merge queue
        ↘ rollback workflow on SLO breach
```

---

### 3. Core Components

- **UI / API Layer:** Operator console, exception approvals, audit log.
- **LLM layer:** Optional failure explainer; optional edge-case patch suggester (reviewed).
- **Agents (if any):** Optional; core is workflow.
- **Tools / Integrations:** Git provider, CI, package graph builder, registry APIs.
- **Memory / RAG:** Playbook retrieval; historical incident notes.
- **Data sources:** `package.json` workspaces, lockfiles, CI configs.

---

### 4. Data Flow

1. **Input:** Register migration version + target scope (paths/teams).
2. **Processing:** Compute shards; enqueue first wave tasks idempotently.
3. **Tool usage:** Run codemod container; push branch; attach CI labels.
4. **Output:** Update status; notify owners; trigger rollback on policy trip.

---

### 5. Agent Interaction (if applicable)

Optional copilot for triage; no autonomous merge without policy unless explicitly configured with heavy guardrails.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Worker pool per region; shard by repo.
- **Caching:** Codemod container image layers; incremental `tsc` caches per PR.
- **Async processing:** Long-running tests as child workflows with timeouts.

---

### 7. Failure Handling

- **Retries:** CI re-run policies with capped attempts; quarantine chronic flakes.
- **Fallbacks:** Freeze wave; open incident ticket with diff bundle attached.
- **Validation:** AST parse must succeed post-transform; reject empty hunks.

---

### 8. Observability

- **Logging:** Wave ids, PR URLs, codemod hashes, merge outcomes.
- **Tracing:** End-to-end migration span per package.
- **Metrics:** Lead time per wave, defect escape rate, revert rate.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Codebase Migration Automation System**:

- **UI / API layer:** Next.js routes or Hono HTTP — auth, rate limits, request validation (Zod), correlation IDs.
- **Orchestration layer:** Temporal / n8n as the orchestration plane; LLM steps as activities with deterministic inputs/outputs.
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
