### 1. System Overview

**Connectors** write raw reviews to a **landing bucket** with provenance. **Normalizer** maps fields to a canonical schema. **Chunker** splits long reviews. **Scoring workers** attach sentiment and multi-label topics. **Aggregator** rolls up by property/day/brand. **Optional summarizer** reads aggregates only for narrative digests.

---

### 2. Architecture Diagram (text-based)

```
Scheduled trigger
        ↓
   Ingest connectors → raw store
        ↓
   Normalize + dedupe → Postgres
        ↓
   Score workers (LLM/classical)
        ↓
   Rollups (Timescale/materialized views)
        ↓
   BI API + alerts
```

---

### 3. Core Components

- **UI / API Layer:** Dashboards, threshold config, drill-down to quotes.
- **LLM layer:** Optional labeling/summarization bounded by schema.
- **Agents (if any):** None required; optional analyst agent offline.
- **Tools / Integrations:** Review providers, Slack/email alerts, BI tools.
- **Memory / RAG:** Taxonomy docs for human operators.
- **Data sources:** Licensed review feeds, first-party post-stay surveys (separate pipeline).

---

### 4. Data Flow

1. **Input:** Pull new reviews since cursor per property.
2. **Processing:** Clean language, translate if needed, score, attach confidence.
3. **Tool usage:** N/A for core path; LLM calls are internal pipeline steps with fixed prompts.
4. **Output:** Update rollups; fire alerts if topic sentiment crosses thresholds week-over-week.

---

### 5. Agent Interaction (if applicable)

Not applicable for core system. Optional **Q&A agent** reads **SQL + small quote set** for executive summaries.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workers by property shard or region.
- **Caching:** Idempotent processing keys per `review_id`; skip unchanged hashes.
- **Async processing:** Backfill jobs separated from incremental hourly syncs.

---

### 7. Failure Handling

- **Retries:** Per-chunk retries; DLQ for repeated failures with payload diagnostics.
- **Fallbacks:** Degrade to star-only aggregates if scoring provider down (flagged).
- **Validation:** Schema validation on model JSON; reject unknown topic IDs.

---

### 8. Observability

- **Logging:** Records processed/sec, error taxonomy, per-connector lag.
- **Tracing:** Trace `pipeline_run_id` across stages.
- **Metrics:** Freshness SLAs, label distribution drift, alert precision (human feedback), cost per million tokens.
