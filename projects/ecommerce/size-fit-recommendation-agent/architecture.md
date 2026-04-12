### 1. System Overview

**Fit quiz UI** collects structured inputs. **Sizing service** computes **candidate size scores** from charts, historical returns, and garment attributes. **Fit Agent** fetches tool JSON and produces **user-facing explanations** plus **alternate sizes** with explicit confidence bands.

---

### 2. Architecture Diagram (text-based)

```
Quiz answers → sizing API (ML + rules)
        ↓
Fit Agent → tools: charts, sku attrs, stock
        ↓
Recommendation payload → PDP widget
```

---

### 3. Core Components

- **UI / API Layer:** PDP widget, admin chart mapping console.
- **LLM layer:** Tool-using agent; strict schema for outputs.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** PIM size charts, OMS stock, analytics warehouse summaries.
- **Memory / RAG:** Parsed chart chunks in vector store for rare brands.
- **Data sources:** Return warehouse, clickstream (aggregated), merchant CSVs.

---

### 4. Data Flow

1. **Input:** `sku_id` + quiz answers + locale.
2. **Processing:** Sizing API returns scored candidates with feature attributions.
3. **Tool usage:** Agent pulls chart rows and stock counts for top candidates.
4. **Output:** JSON consumed by UI renderer + analytics beacon.

---

### 5. Agent Interaction (if applicable)

Single agent. **Checkout size selection** remains explicit user action.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; precompute popular sku score caches.
- **Caching:** Parsed charts by `(brand, season)` version keys.
- **Async processing:** Batch retrain calibration nightly; warm caches on deploy.

---

### 7. Failure Handling

- **Retries:** ML inference retries; fall back to chart-only mode.
- **Fallbacks:** If LLM unavailable, show numeric scores with static copy templates.
- **Validation:** Reject recommendations where stock tool disagrees; reconcile before display.

---

### 8. Observability

- **Logging:** Decision codes, chart versions, model versions.
- **Tracing:** Quiz → scoring → LLM → render timings.
- **Metrics:** Return rate by cohort, OOS suggestion rate, user override rate.
