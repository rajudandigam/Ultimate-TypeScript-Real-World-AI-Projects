### 1. System Overview

**Connectors** pull raw artifacts into a **landing zone**, then **normalizers** map to a canonical schema. **Deduplication** merges identities across feeds. **Indexer** maintains keyword + vector fields. **Analysis API** hosts the **CTI agent** that queries search/graph tools. **Briefing scheduler** produces recurring digests with citations.

---

### 2. Architecture Diagram (text-based)

```
Feeds (STIX/RSS/API)
        ↓
   Connector workers → landing store
        ↓
   Normalize + dedupe → canonical graph (Postgres)
        ↓
   Indexer → OpenSearch
        ↓
   CTI Agent (tools: search, timeline, metrics)
        ↓
   UI / webhooks / exports (STIX)
```

---

### 3. Core Components

- **UI / API Layer:** Search, investigations, connector admin, RBAC.
- **LLM layer:** Grounded analysis agent.
- **Agents (if any):** Primary analyst agent.
- **Tools / Integrations:** SIEM, ticketing, messaging webhooks.
- **Memory / RAG:** Investigation notes linked to entities.
- **Data sources:** Licensed feeds, internal incident exports (governed).

---

### 4. Data Flow

1. **Input:** Scheduled connector runs ingest new documents and IOCs.
2. **Processing:** Normalize, score confidence, set TTLs, update graph edges.
3. **Tool usage:** Analyst asks a question; agent runs constrained searches and aggregates.
4. **Output:** Render answer with citations; optionally open SOAR case with attached evidence IDs.

---

### 5. Agent Interaction (if applicable)

Single agent for Q&A. Background jobs may call LLM for clustering labels with human review queues.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard connectors by tenant; separate search replicas for read-heavy workloads.
- **Caching:** Hot entity pages; precomputed “top rising techniques” rollups.
- **Async processing:** Heavy clustering offline; interactive path stays low-latency.

---

### 7. Failure Handling

- **Retries:** Connector retries with checkpointing; poison message isolation.
- **Fallbacks:** Degraded search (keyword-only) if vector index unhealthy.
- **Validation:** Reject exports that include expired IOCs without explicit override.

---

### 8. Observability

- **Logging:** Connector outcomes, normalization errors, export actions.
- **Tracing:** Trace agent tool chains per `investigation_id`.
- **Metrics:** Ingest lag, dedupe rate, citation coverage, override rate by analysts.
