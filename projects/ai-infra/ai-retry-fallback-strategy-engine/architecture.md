### 1. System Overview

Apps call a **Gateway** that executes a **policy state machine** per request: classify error → wait/backoff → retry alternate route or return controlled failure. State lives in **Redis**; policies in **Postgres**; traces in **OTel**.

---

### 2. Architecture Diagram (text-based)

```
Client
        ↓
   LLM Gateway (TypeScript)
   ├─ Admission control (quotas)
   ├─ Attempt loop (policy engine)
   │    ↓
   │  Provider A → (fail) → Provider B
   │    ↓
   │  Cache fallback / template fallback
   └─ Final response + attempt trace
        ↓
   Observability export
```

---

### 3. Core Components

- **UI / API Layer:** Admin console for policies, kill switches, canary percentages.
- **LLM layer:** Provider adapters only; no business prompts here.
- **Agents (if any):** None in runtime hot path.
- **Tools / Integrations:** Optional cache, secondary providers, static content service.
- **Memory / RAG:** Optional response cache with strict eligibility rules.
- **Data sources:** Provider health signals, historical error rates for adaptive tuning (offline).

---

### 4. Data Flow

1. **Input:** Accept request with idempotency key and policy profile.
2. **Processing:** Attempt primary route with deadline; on normalized error, consult policy graph.
3. **Tool usage:** Optional cache read/write through gated APIs; never bypass policy checks.
4. **Output:** Return body + `Retry-After` semantics internally; attach trace annotations for each attempt.

---

### 5. Agent Interaction (if applicable)

Not applicable. Reliability core remains **declarative**.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless gateway pods; Redis cluster for shared breaker state; shard by tenant.
- **Caching:** Small TTL caches for repeated identical safe queries only.
- **Async processing:** Optional async completion mode for long jobs with webhook callback.

---

### 7. Failure Handling

- **Retries:** Per-error-class policies; overall deadline; partial stream cancellation on failover.
- **Fallbacks:** Template responses for non-critical surfaces; explicit `degraded: true` flag.
- **Validation:** Reject requests missing idempotency keys when policy requires them for tool calls.

---

### 8. Observability

- **Logging:** Attempt count, final route, error classes; no sensitive payloads unless scrubbed.
- **Tracing:** Span per attempt with provider attribute; mark failover edges.
- **Metrics:** Retry rate, breaker open duration, success rate by route, cost per successful user outcome.
