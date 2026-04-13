### 1. System Overview

Users configure an **initiative** with **assumption packages**. **Simulation engine** runs stochastic models producing **metric distributions**. **Multi-agent orchestrator** schedules rounds: **Exec**, **Finance**, **Product**, **Risk** agents propose arguments referencing tool outputs. **Facilitator** merges into a **structured report** artifact with **citations** to simulation tables.

---

### 2. Architecture Diagram (text-based)

```
Assumption UI → versioned package (Postgres)
        ↓
   Simulation worker(s)
        ↓
   Metrics artifacts (tables + charts)
        ↓
   Multi-agent rounds (role agents + critic)
        ↓
   Facilitator merge → report PDF/Markdown
```

---

### 3. Core Components

- **UI / API Layer:** Workshop mode, report viewer, permissions by initiative.
- **LLM layer:** Role agents + critic + facilitator summarization.
- **Agents (if any):** Exec, finance, product, risk, critic, facilitator (non-overlapping tools).
- **Tools / Integrations:** Simulation APIs, BI queries (read), export to Slides/Docs.
- **Memory / RAG:** Prior initiative retrospectives (ACL); research corpus retrieval.
- **Data sources:** Internal KPIs, market data feeds (licensed), user assumptions.

---

### 4. Data Flow

1. **Input:** Create initiative; lock assumption version; kick off baseline sim.
2. **Processing:** Agents read metrics; propose strategic options as structured objects referencing sim ids.
3. **Tool usage:** Additional sweeps requested via tools with pre-approved parameter bounds.
4. **Output:** Publish report with version pins; optional export to board workflow tools.

---

### 5. Agent Interaction (if applicable)

**Critic** challenges unsupported claims; **facilitator** enforces evidence rules and terminates rounds on convergence or budget.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue simulation jobs; separate inference pool for agent rounds; shard workspaces by org.
- **Caching:** Reuse simulation outputs for identical assumption hashes across sessions.
- **Async processing:** Long Monte Carlo paths offline; agents consume finished artifacts.

---

### 7. Failure Handling

- **Retries:** Simulation retries with smaller grids on failure; surface uncertainty explicitly.
- **Fallbacks:** If agents unhealthy, ship numbers-only report from templates.
- **Validation:** Reject agent-proposed parameter sweeps outside allowed ranges.

---

### 8. Observability

- **Logging:** Round counts, tool usage, simulation versions, export events (metadata).
- **Tracing:** Trace `initiative_id` through sim + agent phases.
- **Metrics:** Workshop completion rate, human edit rate on reports, cost per initiative, model/tool failure rates.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Business Strategy Simulator**:

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
