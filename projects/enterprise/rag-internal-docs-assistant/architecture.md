### 1. System Overview

The assistant is a **TypeScript backend** plus **Next.js** UI. Ingestion pipelines normalize documents into **chunks with ACL tags** stored in Postgres/OpenSearch. At query time, a **hybrid retriever** returns candidates filtered by the user’s groups, a **reranker** refines ordering, and the **agent** composes an answer that must reference chunk IDs. Eval jobs run in CI against frozen corpora subsets.

---

### 2. Architecture Diagram (text-based)

```
Employee UI (SSO)
        ↓
   Q&A API (authZ context)
        ↓
   Retrieval service (BM25 + vector + filters)
        ↓
   Reranker (cross-encoder or LLM-lite)
        ↓
   Answer Agent (tools: search, fetch, escalate)
        ↓
   Response + citations + telemetry
```

Parallel path:

```
Connectors (Confluence/Git/Drive)
        ↓
   Chunker + ACL tagger
        ↓
   Index stores (Postgres / OpenSearch)
```

---

### 3. Core Components

- **UI / API Layer:** Authenticated chat, admin reindex controls, feedback capture.
- **LLM layer:** Streaming generation with structured citation payload.
- **Agents (if any):** Single answer agent; optional tiny planner as a tool module.
- **Tools / Integrations:** Connector fetchers, search endpoints, ticketing escalation.
- **Memory / RAG:** Chunk index with version metadata; session store for short-term context.
- **Data sources:** Internal wikis, git markdown, PDFs, tickets (policy permitting).

---

### 4. Data Flow

1. **Input:** User question + resolved `principal` + scope preferences.
2. **Processing:** Retrieve top-k with ACL SQL; rerank; assemble context pack under token cap.
3. **Tool usage:** Agent may fetch full page for cited section only; cannot fetch arbitrary URLs outside allowlist.
4. **Output:** Render answer with citations; persist query log and feedback labels for eval loops.

---

### 5. Agent Interaction (if multi-agent)

Default single agent. If split, use **retrieval planner → answerer** with a shared **trace id** and no bypass of ACL filters in either hop.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Separate read APIs from ingestion workers; read replicas for search.
- **Caching:** Query result cache keyed by `(principal_hash, normalized_question, index_version)` with short TTL.
- **Async processing:** Ingestion and reindex as background jobs; near-line updates for high-churn spaces.

---

### 7. Failure Handling

- **Retries:** Connector pagination retries; search shard retries.
- **Fallbacks:** If reranker down, answer with vector-only results and lower confidence banner.
- **Validation:** Post-generation citation check: every claim paragraph maps to ≥1 chunk id.

---

### 8. Observability

- **Logging:** Query/answer metadata, chunk ids, model versions; redact sensitive content.
- **Tracing:** Spans for retrieve, rerank, generate; correlate with eval run ids in CI.
- **Metrics:** nDCG@k offline, online thumbs, abstain rate, ACL deny counts (should be rare and explainable).
