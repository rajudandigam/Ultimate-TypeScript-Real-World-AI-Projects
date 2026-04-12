### 1. System Overview

**Control plane** stores pipeline definitions and tenant ACL rules. **Orchestrator** schedules connector syncs and embedding jobs. **Index services** host vector + keyword indices per deployment profile. **Query gateway** authenticates requests, applies filters, merges hybrid results, returns citations with **index_version**.

---

### 2. Architecture Diagram (text-based)

```
Admin UI / API
        ↓
   Pipeline registry (Postgres)
        ↓
   Connector + chunk + embed workflows
        ↓
   Index shards (vector + keyword)
        ↓
   Query gateway → clients (apps/agents)
```

---

### 3. Core Components

- **UI / API Layer:** Connector config, ACL matrix, eval dashboards.
- **LLM layer:** Optional offline mapping/chunk advisors—not query hot path required.
- **Agents (if any):** None in core platform.
- **Tools / Integrations:** S3, Confluence, Git, CRM exports, webhooks.
- **Memory / RAG:** The platform itself is the RAG infra; tenant corpora are data planes.
- **Data sources:** Customer documents with provenance metadata.

---

### 4. Data Flow

1. **Input:** Admin publishes pipeline version vN; triggers backfill job.
2. **Processing:** Fetch docs; normalize; chunk; embed; upsert with doc ACL tags.
3. **Tool usage:** Internal admin tools for reindex, canary split, rollback to vN-1.
4. **Output:** Query API returns chunks + scores + version; clients render answers with grounding.

---

### 5. Agent Interaction (if applicable)

Downstream **answer agents** use this system via API; builder remains workflow-centric.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard indices by tenant; separate ingest from query clusters; autoscale embed workers.
- **Caching:** Query result caches keyed by `(tenant, query_hash, index_version)` with short TTL.
- **Async processing:** Large backfills as batch jobs with progress reporting.

---

### 7. Failure Handling

- **Retries:** Per-stage retries; poison docs quarantined with reason codes.
- **Fallbacks:** Serve stale index with banner if new version unhealthy; rollback switch.
- **Validation:** Schema validation on pipeline specs; deny deploy if eval regression thresholds fail.

---

### 8. Observability

- **Logging:** Job outcomes, connector errors, index build durations (no sensitive doc bodies).
- **Tracing:** Trace `job_id` / `query_id` across ingest and query paths.
- **Metrics:** Ingest lag, QPS, p95 retrieval latency, embed cost, ACL denial counts, eval regression alerts.
