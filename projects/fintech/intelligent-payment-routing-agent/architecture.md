### 1. System Overview

Each payment request hits a **router service** that loads **constraints** (contracts, PCI routing rules, prohibited flows) and **scores** from a **metrics aggregator** (Redis/ClickHouse). A **deterministic selector** picks PSP A/B/C. Optional **routing agent** runs offline or in **shadow** to explain decisions or propose weight tweaks reviewed by humans.

---

### 2. Architecture Diagram (text-based)

```
Payment API
        ↓
   Router (constraints + scores)
        ↓
   Selected PSP adapter
        ↓
   Auth / capture / refund flows
        ↓
   Routing log (immutable) → analytics
```

*(Optional)* `Explain agent` reads log JSON for dashboards—not in the synchronous payment thread by default.

---

### 3. Core Components

- **UI / API Layer:** Merchant settings, canary controls, incident banners.
- **LLM layer:** Optional explanation / tuning copilot off hot path.
- **Agents (if any):** Single optional agent for ops tooling.
- **Tools / Integrations:** PSP APIs, billing for fees, feature flags.
- **Memory / RAG:** Runbooks; contract snippets for support tooling.
- **Data sources:** Decline codes, latency probes, settlement reports.

---

### 4. Data Flow

1. **Input:** Normalize payment attempt metadata; enrich with BIN country and risk tags.
2. **Processing:** Compute scores; apply constraints; break ties deterministically with explicit ordering.
3. **Tool usage:** (Async) fetch updated fee tables or incident notes for ops dashboards.
4. **Output:** Route decision attached to downstream PSP call; log outcome for feedback loop.

---

### 5. Agent Interaction (if applicable)

Not on critical path by default. If multi-agent is added later, use a **supervisor** that only proposes **weight deltas** for human approval and simulation.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless router replicas; local in-memory caches with TTL; regional deployment for latency.
- **Caching:** Hot scorecards per `(merchant, segment)`; invalidate on incident flags.
- **Async processing:** Aggregation jobs compute rolling auth rates continuously.

---

### 7. Failure Handling

- **Retries:** PSP call retries with idempotency keys; circuit open routes to backup PSP automatically within constraints.
- **Fallbacks:** Safe default PSP list when metrics unavailable (preconfigured).
- **Validation:** Reject routes that violate MCC bans or cross-border rules before submit.

---

### 8. Observability

- **Logging:** Route code, PSP response times, decline codes (tokenized PAN never logged).
- **Tracing:** Trace `payment_intent_id` across router and PSP spans.
- **Metrics:** Auth rate uplift canaries, failover counts, constraint violation attempts (should be zero), cost per successful txn by route.
