### 1. System Overview

The **planner service** requests candidate legs from **routing providers** and assembles a **route graph**. An **emissions service** attaches **factors per leg** from versioned datasets (RGI, load factors, class of service). The **sustainability agent** reads graph JSON and user weights to produce ranked options and narratives. Results are stored with **methodology_version** for audit.

---

### 2. Architecture Diagram (text-based)

```
User constraints
        ↓
   Route builder (APIs + graph in Postgres)
        ↓
   Emissions calculator (deterministic)
        ↓
   Sustainability Agent (explain + re-rank tools)
        ↓
   Trip artifact + export
```

---

### 3. Core Components

- **UI / API Layer:** Map, sliders, comparison table, methodology disclosure panel.
- **LLM layer:** Explanation agent bound to structured route/emissions JSON.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Rail/bus APIs, flights API, grid intensity datasets.
- **Memory / RAG:** User preference profiles; methodology doc retrieval.
- **Data sources:** Public transport feeds, carrier reported factors (where licensed).

---

### 4. Data Flow

1. **Input:** Parse user trip request and sustainability weights.
2. **Processing:** Build candidate paths; compute emissions per path; prune dominated options in code.
3. **Tool usage:** Agent may request alternate weighting via validated API only (no free-text math).
4. **Output:** Persist chosen trip versions; render uncertainty bands from documented assumptions.

---

### 5. Agent Interaction (if applicable)

Single agent. **Numerical truth** lives in services; agent never overrides calculator output.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless planner API; cache route graphs by `(origin, dest, day)` with TTL.
- **Caching:** Emissions factors by region/month; precomputed popular corridors.
- **Async processing:** Long multi-day overland searches as background jobs with notifications.

---

### 7. Failure Handling

- **Retries:** Routing partial failures return legs with `status=unknown` and exclude from ranking or flag.
- **Fallbacks:** Flight-only baseline path when rail data missing, clearly labeled.
- **Validation:** Reject paths violating max transfers or max walking distance constraints.

---

### 8. Observability

- **Logging:** Provider errors, pruning stats, methodology version per response.
- **Tracing:** Trace `trip_request_id` through routing, emissions, and agent.
- **Metrics:** API success by region, user correction rate, distribution of chosen modes, p95 latency.
