### 1. System Overview

The engine exposes a **Personalization API** used by search and itinerary services. It combines **feature extraction** from allowed events, **retrieval** over historical interactions, and an **LLM scoring** step that returns structured ranking adjustments. All writes to profiles go through **consent-aware** persistence with audit.

---

### 2. Architecture Diagram (text-based)

```
Client / Search BFF
        ↓
   Personalization API
        ↓
   Feature store + consent filter
        ↓
   Retrieval (past trips / lists / rules)
        ↓
   Personalization Agent (LLM + tools)
        ↓
   Ranker merge (deterministic + model deltas)
        ↓
   Ranked results + explain metadata → UI
```

---

### 3. Core Components

- **UI / API Layer:** Preference center, consent management, debug views for internal roles.
- **LLM layer:** Agent producing bounded ranking deltas and explanations.
- **Agents (if any):** Single personalization agent.
- **Tools / Integrations:** Booking DB read APIs, search service, analytics event bus.
- **Memory / RAG:** Vector + structured preference store with ACL.
- **Data sources:** First-party events only unless contractually allowed.

---

### 4. Data Flow

1. **Input:** Receive candidate list ids + user context + consent scope.
2. **Processing:** Fetch features and retrieval bundle; run agent with token budget; validate output schema.
3. **Tool usage:** Pull last trips, saved filters; never pull other users’ data without admin tooling and audit.
4. **Output:** Merge model deltas with baseline scores; return ranked ids + `why` metadata.

---

### 5. Agent Interaction (if applicable)

Single-agent default. Optional specialists only if policy requires separation of duties.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; cache hot profiles; shard feature store by user id.
- **Caching:** Short TTL for ranking explanations; invalidate on consent change events.
- **Async processing:** Heavy embedding updates offline from event streams.

---

### 7. Failure Handling

- **Retries:** Transient retrieval failures → degrade to rule baseline with banner.
- **Fallbacks:** Cold-start path for new users; explicit “insufficient data” UX.
- **Validation:** Reject outputs referencing unknown candidate ids; clamp score deltas.

---

### 8. Observability

- **Logging:** Preference version, retrieval query ids, model version; PII minimization.
- **Tracing:** Span per personalization call linked to search `trace_id`.
- **Metrics:** CTR on explanations shown, opt-out spikes, latency, cost per 1k sessions.
