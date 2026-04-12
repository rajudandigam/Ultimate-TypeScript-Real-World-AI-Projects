### 1. System Overview

Memory management exposes a **Memory API** backed by **Postgres** (structured + ACL), **vector index** (semantic), and **Redis** (session hot path). **Workflow workers** compact, re-embed, and enforce retention. Optional **summarizer agent** runs in isolated workers with no direct DB credentials—only through internal RPCs.

---

### 2. Architecture Diagram (text-based)

```
Agent runtime
        ↓
   Memory API (authZ)
        ↓
   Policy engine → write path / read path
        ↓
   ┌─────────────┬──────────────┬─────────────┐
   │ Session KV  │ Fact store   │ Vector index │
   └─────────────┴──────────────┴─────────────┘
        ↑
   Compaction / summarization workflows
        ↑
   Optional Summarizer Agent (worker)
```

---

### 3. Core Components

- **UI / API Layer:** Admin consoles for retention, export, incident response queries.
- **LLM layer:** Summarization and merge-suggestion jobs—not on critical read path by default.
- **Agents (if any):** Offline summarizer agent; online agents are consumers of Memory API only.
- **Tools / Integrations:** Connectors import email/docs with scanning; all gated.
- **Memory / RAG:** This system **is** the memory substrate.
- **Data sources:** User events, agent traces (redacted), uploaded docs per policy.

---

### 4. Data Flow

1. **Input:** Authenticated `append` with `tenant_id`, `namespace`, payload type, and content hash.
2. **Processing:** Validate schema; DLP scan; write row + enqueue embedding job; update session cache.
3. **Tool usage:** Query path runs hybrid retrieval with mandatory ACL filters; attach provenance bundle to caller.
4. **Output:** Ranked chunks + structured facts; emit audit record for prompt assembly downstream.

---

### 5. Agent Interaction (if applicable)

Online agents **do not** manage memory directly; they call **Memory API**. Summarization agent runs as **batch worker** with scoped credentials.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; partition vector index by tenant; read replicas for hot paths.
- **Caching:** Negative cache for forbidden namespaces; short TTL for repeated identical queries.
- **Async processing:** Embedding and compaction queues with backpressure.

---

### 7. Failure Handling

- **Retries:** Embedding retries with DLQ for poison documents.
- **Fallbacks:** Degrade to structured-only retrieval if vector index unhealthy (explicit banner to caller).
- **Validation:** Reject writes exceeding size; reject cross-namespace references.

---

### 8. Observability

- **Logging:** Access audit stream; separate debug logs without payloads in prod.
- **Tracing:** Trace read and write paths with `memory_trace_id` propagated to agent run traces.
- **Metrics:** p95 query latency, index lag, compaction throughput, deletion SLA compliance.
