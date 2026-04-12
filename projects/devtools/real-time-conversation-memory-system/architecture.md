### 1. System Overview

**Ingest gateway** accepts authenticated **audio/text frames** and writes append-only **segment records**. **Transcription workflow** emits text segments. **Chunker workflow** splits on speaker/time boundaries, runs **redaction**, and enqueues **embedding jobs**. **Query API** serves hybrid retrieval to downstream agents.

---

### 2. Architecture Diagram (text-based)

```
Realtime client → ingest → segment log
        ↓
ASR / text normalize → chunk + redact → embed
        ↓
Vector index → memory.search API → agents / UI
```

---

### 3. Core Components

- **UI / API Layer:** Session viewer, privacy controls, export/delete tools.
- **LLM layer:** Optional rolling summarizer worker.
- **Agents (if any):** Downstream product agents consume memory API; not required here.
- **Tools / Integrations:** ASR provider, KMS, object storage for optional raw audio.
- **Memory / RAG:** pgvector / managed vector + metadata store in Postgres.
- **Data sources:** Chat WS, telephony streams, IDE pair-programming logs (policy scoped).

---

### 4. Data Flow

1. **Input:** Frame arrives with `session_id`, sequence, content type.
2. **Processing:** Buffer until utterance boundary; transcribe if audio.
3. **Tool usage:** Classify PII; quarantine high-risk segments for human review if configured.
4. **Output:** Upsert vectors; expose consistent read after `chunk_committed` event.

---

### 5. Agent Interaction (if applicable)

Memory layer is **not** an autonomous agent by default; optional curator is offline/batch.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by `tenant_id`; dedicated ASR pools.
- **Caching:** Hot session vectors in Redis for ultra-low latency reads (short TTL).
- **Async processing:** Embedding backlog with priority lanes for premium tenants.

---

### 7. Failure Handling

- **Retries:** ASR retries with jitter; dead-letter toxic segments with diagnostics.
- **Fallbacks:** Degrade to keyword-only search if vector index unhealthy.
- **Validation:** Reject cross-session writes without matching auth token.

---

### 8. Observability

- **Logging:** Throughput, chunk sizes, redaction decisions (codes only).
- **Tracing:** End-to-end frame→searchable latency.
- **Metrics:** Index lag, DSAR SLA, search p95, per-tenant storage growth.
