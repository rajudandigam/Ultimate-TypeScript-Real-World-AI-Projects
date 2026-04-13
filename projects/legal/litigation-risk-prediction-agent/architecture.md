### 1. System Overview

**Matter workspace** enforces **ACLs** at index time and query time. **Research Agent** retrieves documents via **scoped search tools** and writes **memo JSON** with citations. **Export service** renders documents inside **DLP** boundaries; **access audit** records every view and download.

---

### 2. Architecture Diagram (text-based)

```
Matter corpus (indexed) → Research Agent
        ↓
Scoped search + timeline tools
        ↓
Draft memo (citations) → attorney workstation
```

---

### 3. Core Components

- **UI / API Layer:** Matter console, redaction preview, export controls.
- **LLM layer:** Tool-using agent with strict citation schema.
- **Agents (if any):** Single agent baseline; optional specialist agents later.
- **Tools / Integrations:** eDiscovery APIs (read), spreadsheet readers, internal outcome DB (privileged).
- **Memory / RAG:** Per-matter vector index; no global cross-client mixing.
- **Data sources:** Pleadings, discovery, transcripts (policy gated).

---

### 4. Data Flow

1. **Input:** Authenticate user to matter; verify need-to-know group.
2. **Processing:** Agent plans queries; fetch top passages with offsets.
3. **Tool usage:** Assemble timeline tables from extracted dates and docket entries.
4. **Output:** Draft memo stored as new version with hash; watermark “draft.”

---

### 5. Agent Interaction (if applicable)

Single agent per session; session tokens bound to one `matter_id`.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard indices per matter; heavy jobs isolated from interactive.
- **Caching:** Query result caches with short TTL and matter-scoped keys.
- **Async processing:** OCR and indexing pipelines decoupled from chat latency.

---

### 7. Failure Handling

- **Retries:** Search retries; never return other matters’ snippets on error paths—fail closed.
- **Fallbacks:** If model unavailable, return search hit list without synthesis.
- **Validation:** Citation span validator ensures offsets exist in source documents.

---

### 8. Observability

- **Logging:** Minimal content logging; access events and performance metrics prioritized.
- **Tracing:** Query→memo spans inside secure boundary.
- **Metrics:** Time-to-memo, citation validation failures, export counts (alerting on anomalies).


---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **Litigation Risk Prediction Agent**:

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
