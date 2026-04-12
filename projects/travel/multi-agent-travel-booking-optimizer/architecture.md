### 1. System Overview

A **supervisor workflow** owns the **offer graph** (flights, hotels, fees, timestamps). **Flight**, **hotel**, and **pricing** agents publish **proposals** as versioned patches. A **validator** enforces hard rules before any **purchase** activity executes through a tightly scoped **executor** service.

---

### 2. Architecture Diagram (text-based)

```
User / API
        ↓
   Booking Supervisor (Temporal)
     ↙      ↓      ↘
Flight     Hotel    Pricing
optimizer  recommender analyzer
     ↘      ↓      ↙
   Supplier tool adapters
        ↓
   Merge + validate + human gate (optional)
        ↓
   Book / hold tools → confirmation artifacts
```

---

### 3. Core Components

- **UI / API Layer:** Bundle explorer, approval for non-refundable paths, admin partner configs.
- **LLM layer:** Specialist agents + supervisor narration/merge assistance.
- **Agents (if any):** Flight optimizer, hotel recommender, pricing analyzer.
- **Tools / Integrations:** Air/hotel APIs, tax/fee services, fraud checks, payment orchestration (policy-gated).
- **Memory / RAG:** Partner rule retrieval; historical fare snapshots.
- **Data sources:** Live supplier payloads, loyalty constraints, corporate policy packs.

---

### 4. Data Flow

1. **Input:** Validate trip request and risk tier; initialize empty offer graph.
2. **Processing:** Run specialists in parallel within deadlines; collect proposals with `expires_at`.
3. **Tool usage:** Supervisor validates merges; pricing analyzer attaches fare snapshot references.
4. **Output:** Persist chosen bundle; route to hold/book; emit receipt artifacts and audit trail.

---

### 5. Agent Interaction (if applicable)

**Roles:** Flight focuses on itinerary feasibility; hotel on nightly geography fit; pricing on total landed cost and volatility. **Communication:** via supervisor state keys, not peer-to-peer. **Orchestration:** merge queue serializes graph writes; max revision rounds.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition supervisor runs by tenant; isolate supplier tool pools; cache geocodes.
- **Caching:** Short-lived price snapshots with TTL; invalidate on search parameter change.
- **Async processing:** Long searches async with client polling or streaming status.

---

### 7. Failure Handling

- **Retries:** Supplier retries with jitter; never double-book without idempotency keys.
- **Fallbacks:** Partial bundles with explicit missing legs; human handoff for edge cases.
- **Validation:** Hard checks on dates, passenger counts, refundability flags after merge.

---

### 8. Observability

- **Logging:** Proposal ids, supplier error codes, merge decisions; redact PII.
- **Tracing:** Trace each specialist and tool call with `booking_run_id`.
- **Metrics:** Conversion funnel, hold expiration rate, fraud block rate, supplier latency heatmaps.
