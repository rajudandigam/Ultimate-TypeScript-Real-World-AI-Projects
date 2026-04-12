### 1. System Overview

**Connector workers** pull incremental updates into a **staging lake**. **Normalizer** maps external issues to a **canonical schema**. **Warehouse upsert** maintains current state + history tables. **Report workflow** builds rollups and delivers channels; optional **LLM summarizer** consumes rollups only.

---

### 2. Architecture Diagram (text-based)

```
Trackers/CI → ingest → staging → warehouse
        ↓
Rollup job → metrics tables → dashboards / Slack
```

---

### 3. Core Components

- **UI / API Layer:** Mapping UI, report builder, access control.
- **LLM layer:** Optional summary generator.
- **Agents (if any):** Optional Q&A over warehouse via controlled SQL tool later.
- **Tools / Integrations:** Jira/Linear/GitHub APIs, CI providers, Slack.
- **Memory / RAG:** Warehouse + snapshot tables; optional style guide RAG.
- **Data sources:** Issues, PRs, deployments, incidents (optional).

---

### 4. Data Flow

1. **Input:** Webhook or poll tick with cursor tokens.
2. **Processing:** Validate payload; upsert canonical rows idempotently.
3. **Tool usage:** Compute aggregates per team/initiative/milestone.
4. **Output:** Publish artifacts; notify subscribers if thresholds crossed.

---

### 5. Agent Interaction (if applicable)

Core is workflow-first; optional chat agent is separate product surface.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard connectors by org; async heavy rollups.
- **Caching:** Materialized views for hot dashboards.
- **Async processing:** Nightly deep reconcile to fix drift.

---

### 7. Failure Handling

- **Retries:** Per-connector policies; DLQ with replay tooling.
- **Fallbacks:** Read-only last-good snapshot if ingest paused.
- **Validation:** Reject unknown issue types until mapping exists.

---

### 8. Observability

- **Logging:** Cursor advancement, schema mapping version, row counts.
- **Tracing:** Webhook→warehouse span latency.
- **Metrics:** Data freshness SLO, error rate by connector, report generation duration.
