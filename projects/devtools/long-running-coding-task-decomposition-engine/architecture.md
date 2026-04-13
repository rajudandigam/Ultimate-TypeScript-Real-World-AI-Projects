### 1. System Overview

**Orchestrator service** accepts a **task spec** and acquires a **repo lease**. **Planner** emits a **DAG** of steps stored in **Postgres**. **Worker** runs the **Coding Agent** loop inside a **sandbox** with tool adapters. **Checkpoint workflow** persists state after each validated milestone; **PR service** opens/updates pull requests.

---

### 2. Architecture Diagram (text-based)

```
Task spec → orchestrator → plan store
        ↓
Sandbox worker → Coding Agent (tools)
        ↓
Git branch / PR → human review → merge
```

---

### 3. Core Components

- **UI / API Layer:** Task console, diff viewer, kill switch, budget editor.
- **LLM layer:** Primary tool-using agent; optional reviewer model (read-only tools).
- **Agents (if any):** Primary agent + optional reviewer (policy-separated).
- **Tools / Integrations:** Git, package manager, test runner, linter, code index.
- **Memory / RAG:** Repo chunk index at pinned commit; checkpoint blobs.
- **Data sources:** Issue tracker links, design docs, CI configs.

---

### 4. Data Flow

1. **Input:** Validate spec schema; freeze target branch SHA optional.
2. **Processing:** Generate/refresh plan; execute next ready step with sandbox token.
3. **Tool usage:** Patch → run tests → capture logs → update checkpoint.
4. **Output:** Push commits; update PR description with evidence appendix.

---

### 5. Agent Interaction (if applicable)

Single writer agent by default; reviewer posts comments only. Multi-writer requires strict file-level locking.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue tasks; **one active lease per repo:branch** to avoid conflicts.
- **Caching:** Incremental compile caches in sandbox volumes (ephemeral).
- **Async processing:** Long test suites streamed to object storage for later summarization.

---

### 7. Failure Handling

- **Retries:** Transient sandbox failures; never auto-merge on flaky green.
- **Fallbacks:** Pause with actionable error; notify human if budget exceeded.
- **Validation:** Patch grammar checks; deny binary file edits unless allowlisted.

---

### 8. Observability

- **Logging:** Step ids, tool latencies, redaction counts, policy violations.
- **Tracing:** Task-level trace across sandbox and git operations.
- **Metrics:** Task completion rate, human intervention rate, CI cost per task.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Long-Running Coding Agent (Task Decomposition Engine)**:

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
