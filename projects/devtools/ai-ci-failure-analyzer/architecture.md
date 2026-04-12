### 1. System Overview

The analyzer is a **webhook-driven service** that builds a **failure context bundle** (metadata, log excerpts, test artifacts, diff summary), runs a **bounded tool loop** with an LLM, and posts a **versioned diagnosis** linked to the CI run. Historical failures are retrieved from a **search index** keyed by workflow, error signatures, and image identifiers.

---

### 2. Architecture Diagram (text-based)

```
CI provider webhook
        ↓
   Ingest API (verify + dedupe)
        ↓
   Context builder → CI APIs / artifact store / Git
        ↓
   Failure Analyzer Agent (LLM + tools)
     ↙     ↓     ↘
fetchLogs fetchTests searchHistory
        ↓
   Output validator (schema + citation checks)
        ↓
   PR comment / Check run / Ticket body
```

---

### 3. Core Components

- **UI / API Layer:** Webhook receiver, optional dashboard for triage quality.
- **LLM layer:** Single agent with structured diagnosis schema.
- **Agents (if any):** One primary analyzer agent.
- **Tools / Integrations:** CI REST APIs, git host, artifact storage, search index.
- **Memory / RAG:** Embeddings or lexical index over normalized failure records.
- **Data sources:** Logs, JUnit, build traces, workflow definitions, commit metadata.

---

### 4. Data Flow

1. **Input:** Receive failure event; compute idempotency key from `(repo, run_id, job_id, attempt)`.
2. **Processing:** Fetch and normalize logs; extract failing tests; summarize diff hunk metadata.
3. **Tool usage:** Agent requests additional files or historical matches; each response stored as evidence.
4. **Output:** Validate JSON; render comment with deep links to logs and prior incidents.

---

### 5. Agent Interaction (if applicable)

Single-agent design. Optional future split only for **write** proposals (patches) vs **read** diagnosis.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless workers behind a queue; shard by `installation_id`.
- **Caching:** Cache log fetch by artifact ETag; cache embeddings for unchanged error blobs.
- **Async processing:** Large logs processed in background with progressive UI updates.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on CI APIs; cap total fetch time per job.
- **Fallbacks:** If agent fails, post minimal deterministic summary with raw links.
- **Validation:** Reject outputs referencing SHAs or paths not present in bundle.

---

### 8. Observability

- **Logging:** Structured logs per `run_id`; separate security audit for repo access.
- **Tracing:** OpenTelemetry spans per tool call and model completion.
- **Metrics:** Diagnosis latency, tool error ratio, human correction rate, token cost per failure class.
