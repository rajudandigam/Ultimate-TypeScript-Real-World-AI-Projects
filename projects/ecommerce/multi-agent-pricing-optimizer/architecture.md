### 1. System Overview

A **supervisor service** orchestrates three agents and a **numeric optimizer**. Agents produce **signals and constraints** (competitor summaries, demand forecasts, strategic weights). The optimizer computes candidate prices checked by **policy validators** before any publish tool executes.

---

### 2. Architecture Diagram (text-based)

```
Scheduler / pricing console
        ↓
   Supervisor (workflow + locks)
        ↓
┌──────────────┐   ┌─────────────────┐   ┌──────────────────┐
│ Competitor   │   │ Demand          │   │ Pricing          │
│ Analyzer     │   │ Predictor       │   │ Strategist       │
│ Agent        │   │ Agent           │   │ Agent            │
└──────┬───────┘   └────────┬────────┘   └────────┬─────────┘
       ↓                    ↓                     ↓
   Market signals      Forecast features    Strategy weights
        └──────────────────┴────────────────────┘
                          ↓
               Constrained optimizer (non-LLM core)
                          ↓
               Validators (MAP, margin, law)
                          ↓
               Publish tools (Shopify, etc.)
```

---

### 3. Core Components

- **UI / API Layer:** Pricing approvals, experiment configuration, audit viewer.
- **LLM layer:** Three specialist agents plus optional summarizer for exec views.
- **Agents (if any):** Competitor analyzer, demand predictor, pricing strategist.
- **Tools / Integrations:** Data warehouse SQL, competitor ingestion, commerce APIs, promo calendar.
- **Memory / RAG:** Retrieved notes on prior campaigns; not a substitute for live inventory reads.
- **Data sources:** Web feeds (compliant), internal transactions, inventory, cost of goods.

---

### 4. Data Flow

1. **Input:** SKU scope + objective (margin vs revenue) + guardrail profile.
2. **Processing:** Fetch competitor and internal features in parallel; agents return structured JSON payloads.
3. **Tool usage:** Optimizer queries validated numbers; dry-run publish returns channel-specific diffs.
4. **Output:** Approved matrix published with monotonic version; subscribers invalidate caches.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Analyzer focuses on external comparables; predictor focuses on historical demand and seasonality; strategist encodes commercial intent (clearance vs premium positioning). **Communication:** all via supervisor state keys (`signals`, `forecast`, `weights`). **Orchestration:** supervisor enforces ordering, retries partial failures, and blocks publish if any agent reports stale data beyond threshold.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard batch jobs by category/region; isolate scraper workers.
- **Caching:** Cache competitor snapshots with TTL; cache expensive warehouse queries.
- **Async processing:** Nightly full repricing plus incremental intraday deltas for hot SKUs.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; partial SKU failures should not block entire batch without policy.
- **Fallbacks:** If agents fail, fall back to last known good prices and alert operators.
- **Validation:** Zero tolerance for MAP violations in automated path; human override requires elevated role + reason code.

---

### 8. Observability

- **Logging:** Structured audit of inputs/outputs per SKU group; separate security log for publish actions.
- **Tracing:** Trace agent loops and optimizer spans with shared `job_id`.
- **Metrics:** Constraint violations prevented, experiment uplift, publish latency, data staleness histograms.
