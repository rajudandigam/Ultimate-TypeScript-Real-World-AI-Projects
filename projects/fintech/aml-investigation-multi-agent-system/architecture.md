### 1. System Overview

Alerts create **cases** in Postgres with RBAC. A **workflow** stages investigation: scope → query → hypothesize → draft → QC → supervisor sign-off. **Detector**, **Analyst**, and **Reviewer** agents each have **tool allowlists**. **Evidence store** holds immutable references to underlying records (not raw dumps in LLM logs by default).

---

### 2. Architecture Diagram (text-based)

```
TM alert → case workflow
        ↓
   Evidence subgraph builder (bounded)
        ↓
   Detector Agent (pattern tools)
        ↓
   Analyst Agent (narrative draft tools)
        ↓
   Reviewer Agent (QC rubric + policy tools)
        ↓
   Human AML officer approval
        ↓
   Case export / SAR worksheet (human filed)
```

---

### 3. Core Components

- **UI / API Layer:** Analyst workstation, supervisor approvals, audit viewer.
- **LLM layer:** Multi-agent reasoning with citation requirements.
- **Agents (if any):** Detector, analyst, reviewer (+ optional supervisor LLM summarizer).
- **Tools / Integrations:** TM system, core banking queries (read), KYC vault pointers, sanctions.
- **Memory / RAG:** Typology retrieval; internal procedures with access logs.
- **Data sources:** Transactions, parties, KYC summaries, watchlist hits.

---

### 4. Data Flow

1. **Input:** Alert ingested; case created; assign analyst and priority.
2. **Processing:** Build bounded subgraph; detector proposes hypotheses with supporting txn IDs.
3. **Tool usage:** Analyst queries additional slices via audited tools; reviewer runs QC checklist tools.
4. **Output:** Draft narrative package versioned; human edits tracked; final disposition recorded.

---

### 5. Agent Interaction (if applicable)

**Reviewer** can send structured rework requests to **Analyst** without exposing customer channels (no tipping-off). **Supervisor** resolves conflicts and enforces closure deadlines.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition case workers by region/tenant; isolate LLM inference pools from query services.
- **Caching:** Reuse subgraph snapshots per case version; invalidate on new data pulls.
- **Async processing:** Heavy graph queries as background activities with progress UI.

---

### 7. Failure Handling

- **Retries:** Query retries with backoff; partial results clearly labeled incomplete.
- **Fallbacks:** Manual mode if agents disabled; retain structured query results.
- **Validation:** Block exports missing mandatory sections; block narrative if citations missing.

---

### 8. Observability

- **Logging:** Tool access audit, agent stage timings, QC failure reasons (structured).
- **Tracing:** Trace `case_id` across workflow and agent tool calls (PII minimized).
- **Metrics:** Case backlog age, analyst throughput, QC rework rate, factual correction incidents (target low), export volume anomalies.


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AML Investigation Multi-Agent System**:

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
