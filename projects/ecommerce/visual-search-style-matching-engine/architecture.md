### 1. System Overview

**Image ingress** normalizes uploads and extracts **safe derivatives**. **Embedding worker** computes **query vectors**; **search service** runs **hybrid vector + metadata** retrieval with **business rules** (stock, geo, channel). **Visual Search Agent** consumes ranked JSON to produce shopper-facing explanations and follow-up actions.

---

### 2. Architecture Diagram (text-based)

```
Client image → preprocess → embed
        ↓
Hybrid search (vector + filters)
        ↓
Visual Search Agent → policy tools
        ↓
Ranked results + explanations
```

---

### 3. Core Components

- **UI / API Layer:** Upload API, results grid, feedback chips.
- **LLM layer:** Tool-using agent; optional small model for on-device captions later.
- **Agents (if any):** Single agent in v1.
- **Tools / Integrations:** Vector index, catalog API, rules engine, moderation service.
- **Memory / RAG:** Catalog chunks (title/desc/attrs); session prefs store.
- **Data sources:** PIM, DAM renditions, pricing service.

---

### 4. Data Flow

1. **Input:** User supplies image or product seed id.
2. **Processing:** Embed → retrieve top K candidates → apply reranker (learned or heuristic).
3. **Tool usage:** Agent fetches attribute JSON for top N; checks policy flags.
4. **Output:** Render cards + grounded rationale + next-step queries.

---

### 5. Agent Interaction (if applicable)

Single agent. **Purchasing** remains checkout service—not an LLM tool in v1.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; shard index by tenant; async embedding backfill jobs.
- **Caching:** Popular query embeddings; CDN for thumbnails.
- **Async processing:** Bulk re-embed on catalog updates with prioritized queues.

---

### 7. Failure Handling

- **Retries:** Transient vector errors; switch to keyword-only degraded mode.
- **Fallbacks:** If LLM unavailable, return silent results with attribute bullets from templates.
- **Validation:** Reject oversized images; strip EXIF; block non-allowlisted URL fetches.

---

### 8. Observability

- **Logging:** Query ids, candidate sku ids, rule blocks (no PII in prompts where possible).
- **Tracing:** End-to-end path segmented by embed/search/LLM.
- **Metrics:** CTR, conversion lift, zero-hit rate, moderation blocks, index lag per tenant.
