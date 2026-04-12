### 1. System Overview

Feedback events land in an **ingest API**, pass **consent + DLP** gates, and enqueue **curation workflows**. Batch jobs **dedupe**, **cluster**, and **package exports**. An **agent worker** proposes actions (PRs, tickets) via tools; **human approval** services gate mutations.

---

### 2. Architecture Diagram (text-based)

```
Clients / support webhooks
        ↓
   Feedback ingest API
        ↓
   Consent + DLP workflow
        ↓
   Dedupe + cluster jobs
        ↓
   Curation Agent (optional) → PR / ticket tools
        ↓
   Human approval service
        ↓
   Dataset export store (immutable manifests)
```

---

### 3. Core Components

- **UI / API Layer:** Feedback widgets, reviewer workbench, admin policy console.
- **LLM layer:** Clustering and summarization agent in offline workers.
- **Agents (if any):** Curation agent with write tools only after approval tokens attached.
- **Tools / Integrations:** Git, ticketing, Slack, object storage, training pipeline APIs.
- **Memory / RAG:** Embeddings for dedupe; retrieval of similar historical clusters.
- **Data sources:** Redacted transcripts, trace ids, rubric labels, moderator notes.

---

### 4. Data Flow

1. **Input:** Authenticate source; attach `trace_id`, `user_consent`, `product_surface`.
2. **Processing:** Validate schema; quarantine if DLP fails; enqueue for dedupe fingerprinting.
3. **Tool usage:** After human batch approval, export tool writes versioned JSONL + manifest checksum.
4. **Output:** Notify downstream training job or prompt repo PR with linked feedback ids.

---

### 5. Agent Interaction (if applicable)

Agent is **offline** and **tool-gated**. No autonomous training; proposals are artifacts for humans.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingest by tenant; autoscale clustering workers separately from API.
- **Caching:** Bloom filters / minhash for dedupe; cache cluster centroids cautiously with TTL.
- **Async processing:** All heavy steps async; priority queues for high-severity feedback.

---

### 7. Failure Handling

- **Retries:** Transient storage errors; not for consent failures without human override.
- **Fallbacks:** Manual CSV export path if automation degraded.
- **Validation:** Manifest verification on byte counts and checksums before marking export complete.

---

### 8. Observability

- **Logging:** Ingest counts, quarantine reasons, approval latencies (no raw PII).
- **Tracing:** Trace workflows end-to-end with `feedback_batch_id`.
- **Metrics:** Export success rate, cluster stability over time, reviewer throughput.
