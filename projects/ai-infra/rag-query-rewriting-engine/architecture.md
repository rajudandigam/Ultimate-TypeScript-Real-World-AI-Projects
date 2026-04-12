### 1. System Overview

Clients call **Rewriter API** with `(tenant, corpus_id, query, context)`. **Policy engine** selects allowed strategies. **Rewriter agent** emits `RetrievalPlan`. **Validator** checks schema + facet vocab. **Search coordinator** executes plan against **vector + keyword** indices and returns merged hits + debug trace for eval.

---

### 2. Architecture Diagram (text-based)

```
Client query
        ↓
   Rewriter API
        ↓
   Rewriter Agent → RetrievalPlan JSON
        ↓
   Validator (schema + facets)
        ↓
   Hybrid search coordinator
        ↓
   Ranked hits + trace metadata
```

---

### 3. Core Components

- **UI / API Layer:** Playground, A/B flags, admin policy editor.
- **LLM layer:** Small fast model for rewrite; optional larger model behind feature flag.
- **Agents (if any):** Single rewriter agent.
- **Tools / Integrations:** Facet index, synonym tables, optional click log queries.
- **Memory / RAG:** Corpus-specific rewrite packs; negative patterns store.
- **Data sources:** Metadata catalogs, prior eval datasets.

---

### 4. Data Flow

1. **Input:** Accept query; attach session summary hash if allowed.
2. **Processing:** Agent selects strategies; emits subqueries + filters + optional HyDE text.
3. **Tool usage:** Tools return allowed facet values and expansions from curated tables.
4. **Output:** Coordinator runs searches in parallel; merges; attaches `rewrite_trace_id` for observability.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional **ensemble** is multiple deterministic strategies, not multiple chat personas.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless rewriter replicas; separate search pool; cache hot plans.
- **Caching:** Memoize rewrite outputs keyed by `(query_hash, corpus_version, policy_version)`.
- **Async processing:** Offline batch rewrite for eval datasets during development.

---

### 7. Failure Handling

- **Retries:** Retry model once; fallback to baseline rewrite on failure.
- **Fallbacks:** If filters too aggressive and zero hits, auto-widen per policy ladder.
- **Validation:** Reject plans referencing unknown facet values; clamp number of subqueries.

---

### 8. Observability

- **Logging:** Strategy distribution, validation failures, zero-hit correlates (aggregated).
- **Tracing:** Trace `request_id` through rewriter and each subquery execution.
- **Metrics:** Lift metrics from A/B, latency added by rewriter, token usage, injection attempt counters.
