### 1. System Overview

The system exposes a **Forecast API**. A worker layer maintains **feature tables** (seasonality, capacity proxies). The **agent** issues **read-only** queries and supplier pulls, then emits a **structured forecast** validated by schema and numeric sanity checks.

---

### 2. Architecture Diagram (text-based)

```
Forecast request
        ↓
   Feature service (SQL / precomputed)
        ↓
   Live fare snapshot tool (rate-limited)
        ↓
   Forecast Agent (LLM)
        ↓
   Validator (schema + bounds + disclaimer injection)
        ↓
   Client response + audit record
```

---

### 3. Core Components

- **UI / API Layer:** Date pickers, confidence visualization, admin model version controls.
- **LLM layer:** Agent summarizing quantitative results only.
- **Agents (if any):** Single forecasting agent.
- **Tools / Integrations:** Warehouse SQL, fare APIs, holiday feeds.
- **Memory / RAG:** Optional retrieval of airline policy change notes; versioned.
- **Data sources:** Historical prices, searches, events (privacy compliant).

---

### 4. Data Flow

1. **Input:** Parse route/date parameters; choose model profile and horizon policy.
2. **Processing:** Load features; optionally fetch live snapshot; assemble evidence bundle.
3. **Tool usage:** Agent may request additional slices (nearby dates) within budgets.
4. **Output:** Return JSON forecast + store for offline calibration evaluation.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional separate **hotel** sub-agent only if metrics justify split.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; precompute popular routes; queue expensive refreshes.
- **Caching:** Cache forecasts keyed by `(route, dates, cabin, supplier_snapshot_hash)` with short TTL.
- **Async processing:** Batch calibration jobs nightly.

---

### 7. Failure Handling

- **Retries:** Supplier read retries with jitter; degrade to historical-only mode.
- **Fallbacks:** Explicit “insufficient data” with minimum history requirements.
- **Validation:** Reject if live snapshot missing and policy forbids historical-only claims.

---

### 8. Observability

- **Logging:** Model version, feature version, supplier latency; no sensitive traveler identifiers in aggregates.
- **Tracing:** Span per tool call; link to evaluation jobs.
- **Metrics:** Calibration error over rolling windows, API quota usage, cache effectiveness.
