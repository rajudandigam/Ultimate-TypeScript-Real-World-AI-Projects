### 1. System Overview

**Ingest workflows** normalize documents into chunks with **ACL tags** and **metadata facets**. **Dual writers** update **keyword** and **vector** indices with the same `chunk_id`. **Query service** fans out searches, **fuses** results, optionally calls **reranker**, returns hits with **score breakdown** and **index_version**.

---

### 2. Architecture Diagram (text-based)

```
Ingest pipeline
   ↙        ↘
keyword   vector
 index      index
        ↓
   Query API (parallel search)
        ↓
   Fusion (RRF / weighted)
        ↓
   Optional reranker
        ↓
   Client hits + debug trace
```

---

### 3. Core Components

- **UI / API Layer:** Admin console, relevance playground, canary controls.
- **LLM layer:** Optional rerank cross-encoder (could be non-LLM model).
- **Agents (if any):** None in core retrieval path.
- **Tools / Integrations:** Embeddings provider, object storage, CI eval harness.
- **Memory / RAG:** Fusion configs; feedback store for offline tuning.
- **Data sources:** Tenant documents and metadata catalogs.

---

### 4. Data Flow

1. **Input:** Client sends query + optional filters + `corpus_id`.
2. **Processing:** Dispatch BM25 and ANN queries with same filter semantics.
3. **Tool usage:** Internal admin operations for reindex, segment swap, rollback via workflow APIs.
4. **Output:** Return ranked list with stable `chunk_id` ordering for pagination.

---

### 5. Agent Interaction (if applicable)

Optional upstream query rewriter is separate service; not part of hybrid engine core.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless query nodes; shard indices; separate hot read replicas; GPU pool for rerank.
- **Caching:** Popular query caches; precomputed popular facets.
- **Async processing:** Full rebuilds vs incremental updates with consumer lag metrics.

---

### 7. Failure Handling

- **Retries:** Per-shard retries; partial results flagged if one backend unhealthy.
- **Fallbacks:** Keyword-only if vector degraded; tighten k automatically.
- **Validation:** Reject queries exceeding complexity budgets; enforce ACL on every hit re-fetch.

---

### 8. Observability

- **Logging:** Stage timings, fusion mode, rerank batch sizes (no sensitive hit text by default).
- **Tracing:** Trace `query_id` across backends with sampling.
- **Metrics:** QPS, p95 latency per stage, error rates, zero-hit rate, nDCG from periodic eval jobs, index lag.
