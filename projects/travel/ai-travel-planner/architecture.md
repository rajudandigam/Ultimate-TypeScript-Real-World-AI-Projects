### 1. System Overview

The travel planner uses a **canonical trip graph** maintained by a **planner agent** that merges structured proposals from **flights**, **hotels**, and **activities** specialists. Each specialist has **domain-scoped tools** (supplier and maps APIs). The runtime favors **explicit orchestration** and validation over open-ended multi-chat, with clear provenance on prices and availability.

---

### 2. Architecture Diagram (text-based)

```
User / API (structured trip request)
        ↓
   Planner Agent (merge + validate)
     ↙    ↓    ↘
Flights   Hotels   Activities
 Agent     Agent     Agent
     ↘    ↓    ↙
   Supplier + Maps tools
        ↓
   Trip graph store (versioned)
        ↓
   Itinerary artifact + UI / booking links
```

---

### 3. Core Components

- **UI / API Layer:** Structured request forms, diff view of plan revisions, approval for spend-sensitive steps.
- **LLM layer:** Planner + three specialists; structured patch operations between stages.
- **Agents (if any):** Planner, flights, hotels, activities agents with separate tool registries.
- **Tools / Integrations:** Flight/hotel APIs (as licensed), maps routing, calendar constraints.
- **Memory / RAG:** Historical preferences and trip notes; policy corpora for cancellation rules.
- **Data sources:** Live supplier responses, static geography references, user profile tables.

---

### 4. Data Flow

1. **Input:** Validate request schema; resolve user profile and hard constraints (budget, mobility).
2. **Processing:** Planner requests parallel proposals with deadlines; validates airport continuity and time windows.
3. **Tool usage:** Specialists call APIs; results normalized to proposal objects with `expiresAt` and `evidence` payloads.
4. **Output:** Merge into graph; run deterministic validators; render user-facing packet with staleness markers.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Planner owns global constraints; specialists propose patches within their domains. **Communication:** proposals submitted to supervisor state, not peer-to-peer negotiation. **Orchestration:** merge queue serializes writes; max revision rounds; explicit reject reasons for specialist retries.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API tier; queue proposal jobs per trip; cache geocodes and route matrices.
- **Caching:** Short TTL on price snapshots; fingerprint searches to avoid duplicate supplier calls.
- **Async processing:** Long-running searches stream partial results to UI.

---

### 7. Failure Handling

- **Retries:** Supplier retries with backoff; partial itinerary mode when one domain fails.
- **Fallbacks:** Human handoff with evidence bundle if automation cannot satisfy constraints.
- **Validation:** Hard checks on time geography, budget ledger, and policy flags after every merge.

---

### 8. Observability

- **Logging:** Proposal IDs, merge decisions, supplier error taxonomy (no secrets in logs).
- **Tracing:** Trace each agent and external API call with `trip_id`.
- **Metrics:** Proposal acceptance rate, supplier latency, cost per trip planned, user override reasons.
