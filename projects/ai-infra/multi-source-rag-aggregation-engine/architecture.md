### 1. System Overview

The engine exposes a **Fusion API**. It fans out parallel queries to **connectors**, normalizes results into `Hit` records, runs **dedupe** and **cross-source alignment**, applies **reranking**, and returns an **EvidencePack**. An optional **agent** coordinates additional retrieval rounds within budgets.

---

### 2. Architecture Diagram (text-based)

```
User query + principal
        ↓
   Fusion orchestrator
   ├─ Connector A (wiki)
   ├─ Connector B (tickets)
   └─ Connector C (SQL facts)
        ↓
   Normalize + dedupe + align
        ↓
   Reranker (cross-encoder / LLM-lite)
        ↓
   Optional: Agent refine loop (tools: fetch, compare)
        ↓
   EvidencePack JSON → LLM app
```

---

### 3. Core Components

- **UI / API Layer:** Admin for source weights, budgets, and connector credentials rotation.
- **LLM layer:** Optional orchestrator agent for iterative retrieval.
- **Agents (if any):** Single fusion agent when enabled.
- **Tools / Integrations:** Multiple search backends, object storage for blobs, SQL with RLS.
- **Memory / RAG:** Indexes per source; fusion scratch state ephemeral.
- **Data sources:** Wikis, tickets, git, structured tables—each with freshness metadata.

---

### 4. Data Flow

1. **Input:** Authenticate; resolve enabled sources and max tokens/bytes.
2. **Processing:** Parallel queries with deadlines; merge hits; detect duplicates and conflicts.
3. **Tool usage:** Agent may request additional doc fetches; each response appended with ids.
4. **Output:** Produce pack with ranking scores, conflict list, per-source staleness notes.

---

### 5. Agent Interaction (if applicable)

Single orchestrator agent optional. If multi-source specialists exist, they return **Hit lists only**; fusion remains deterministic code + reranker.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless orchestrator; connector pools scaled independently; cache popular queries with strict TTL.
- **Caching:** Per-source ETag-aware caching; avoid cross-tenant cache pollution.
- **Async processing:** Large packs built asynchronously for batch jobs.

---

### 7. Failure Handling

- **Retries:** Per connector; partial pack with explicit `missing_sources[]` on failures.
- **Fallbacks:** Reduce to highest-trust source set if others unhealthy.
- **Validation:** Reject packs exceeding byte limits; validate every chunk has `source_id`.

---

### 8. Observability

- **Logging:** Query id, per-source latency, hit counts, reranker outcomes.
- **Tracing:** Span per connector and per rerank; propagate `fusion_id`.
- **Metrics:** Conflict rate, truncation rate, ACL deny counts, user thumbs downstream.
