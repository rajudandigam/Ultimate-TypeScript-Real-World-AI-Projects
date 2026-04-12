### 1. System Overview

**Event pipeline** ingests reads, dwell time, follows, hides. **Feature store** computes user and item features. **Candidate generator** pulls recent articles from **search index** respecting publisher contracts. **Mixer** applies diversity and business rules. **Personalization agent** optionally generates **explanations** and proposes **mixer knob** adjustments within server-enforced bounds.

---

### 2. Architecture Diagram (text-based)

```
Client events → stream
        ↓
   Feature store (Postgres/OLAP)
        ↓
   Candidate retrieval (OpenSearch)
        ↓
   Mixer + ranker
        ↓
   Optional explanation agent
        ↓
   Feed response + “why” metadata
```

---

### 3. Core Components

- **UI / API Layer:** Reader app, feedback controls, publisher tools.
- **LLM layer:** Explanation/query understanding agent (optional per request).
- **Agents (if any):** Single agent for interactive “why” and discovery chat.
- **Tools / Integrations:** Search, subscription entitlements, notification push.
- **Memory / RAG:** User interest graph; article metadata index; editorial collections.
- **Data sources:** Licensed content feeds, first-party reporting, user behavior (consented).

---

### 4. Data Flow

1. **Input:** Request feed page; attach user context and locale.
2. **Processing:** Retrieve candidates; apply mixer; compute final ordering.
3. **Tool usage:** If user asks “why”, agent fetches allowed explanation fields from metadata tools only.
4. **Output:** Return cards with canonical URLs; log impression events for training/eval.

---

### 5. Agent Interaction (if applicable)

Single agent for explanations; **ranking numbers** come from ranker service, not LLM arithmetic.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless feed API; cache personalized segments; precompute “cold start” defaults.
- **Caching:** Popular article embeddings; per-user small profile caches with TTL.
- **Async processing:** Offline training jobs for rankers; nightly editorial bundle updates.

---

### 7. Failure Handling

- **Retries:** Search retries; degrade to editor-curated list if personalization unhealthy.
- **Fallbacks:** Disable explanations if model provider down.
- **Validation:** Enforce publisher allowlist on every item in response payload.

---

### 8. Observability

- **Logging:** Impression/click pipelines, mixer knob distributions, explanation request rate.
- **Tracing:** Trace `feed_request_id` through retrieval and rank stages.
- **Metrics:** CTR, dwell time, unsubscribes, diversity metrics, latency percentiles, cost per active reader.
