### 1. System Overview

**Event pipeline** emits `cart.abandoned` facts. **Workflow** debounces and schedules **touch windows** respecting quiet hours. **Recovery Agent** builds a **validated message plan**. **ESP executor** sends with idempotency; **purchase listener** cancels pending touches.

---

### 2. Architecture Diagram (text-based)

```
Commerce events → workflow (debounce, quiet hours)
        ↓
Recovery Agent → tools: cart, promos, consent
        ↓
Validator → ESP executor → webhooks/telemetry
```

---

### 3. Core Components

- **UI / API Layer:** Marketer console, preview, experiment flags.
- **LLM layer:** Agent generating structured message plans.
- **Agents (if any):** Single agent in v1.
- **Tools / Integrations:** Cart APIs, promo service, consent registry, ESP.
- **Memory / RAG:** Brand voice snippet retrieval; touch history store.
- **Data sources:** CDP events, storefront webhooks.

---

### 4. Data Flow

1. **Input:** Abandonment signal with `cart_id`, locale, channel eligibility.
2. **Processing:** Agent loads cart lines + inventory + allowed promos.
3. **Tool usage:** Check consent and frequency caps before finalizing plan.
4. **Output:** ESP API call with template ids + dynamic fields + audit row.

---

### 5. Agent Interaction (if applicable)

Single agent. **Actual send** executed by trusted worker after schema validation.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by tenant; queue per ESP rate limits.
- **Caching:** Product metadata snapshots to reduce cart service chatter.
- **Async processing:** Bulk replays after ESP outages with dedupe keys.

---

### 7. Failure Handling

- **Retries:** ESP retry policies; never exceed frequency caps after success uncertainty—query ESP status first.
- **Fallbacks:** Static template if LLM validation fails twice.
- **Validation:** Block messages mentioning unavailable promos or OOS hero SKU.

---

### 8. Observability

- **Logging:** Plan ids, validation errors, suppression reasons (OOS, consent).
- **Tracing:** Event→plan→send latency.
- **Metrics:** Recovery rate, unsubscribes per thousand sends, LLM refusal rate.
