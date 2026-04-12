### 1. System Overview

**Ingest API** accepts analyzer JSON artifacts tagged by **repo** and **commit**. **Normalizer** maps paths to stable module keys. **Aggregator** writes time-series points and computes **week-over-week deltas**. **Notification workflow** emits digests when thresholds breach.

---

### 2. Architecture Diagram (text-based)

```
CI → artifact store → normalize → metrics DB
        ↓
Scheduled workflow → aggregates → alerts / UI
```

---

### 3. Core Components

- **UI / API Layer:** Explorer UI, team filters, export to CSV.
- **LLM layer:** Optional digest generator (aggregates only).
- **Agents (if any):** None in v1.
- **Tools / Integrations:** GitHub/GitLab APIs for churn; CODEOWNERS parser.
- **Memory / RAG:** Metric warehouse; optional ADR index for context links.
- **Data sources:** ESLint, ts-morph summaries, madge graphs, git log.

---

### 4. Data Flow

1. **Input:** Post-merge CI uploads bundle with tool versions pinned.
2. **Processing:** Parse, validate schema, upsert rows idempotently.
3. **Tool usage:** Join ownership; compute top regressions vs baseline window.
4. **Output:** Persist snapshot; enqueue notifications if policy matches.

---

### 5. Agent Interaction (if applicable)

Not required for core metrics path.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by `org_id`; async workers per repo.
- **Caching:** Per-commit derived aggregates; invalidate on re-ingest.
- **Async processing:** Large repos analyzed in chunked path batches.

---

### 7. Failure Handling

- **Retries:** Transient DB writes with idempotency keys.
- **Fallbacks:** Skip LLM digest if unavailable; numeric tables still ship.
- **Validation:** Reject bundles with mismatched commit SHA vs webhook context.

---

### 8. Observability

- **Logging:** Rows ingested, parse errors, tool versions.
- **Tracing:** Ingest→normalize→aggregate spans.
- **Metrics:** Freshness lag per repo, digest open-rate (if tracked), false alert rate from human feedback.
