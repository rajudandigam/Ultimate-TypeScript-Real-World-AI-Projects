### 1. System Overview

Merchants define **constraints** and **SKUs** in the console. **Experiment service** stores `ExperimentSpec` versions. **Assignment worker** integrates with storefront or BFF to bucket users/sessions. **Metrics pipeline** aggregates KPIs. **Pricing agent** proposes new specs and interprets results using **read tools** only until approval gates open writes.

---

### 2. Architecture Diagram (text-based)

```
Merchant console
        ↓
   Experiment API (Postgres)
        ↓
   Storefront/BFF (assignment)
        ↓
   Events + orders → analytics warehouse
        ↓
   Pricing Agent (read metrics tools)
        ↓
   Recommendations + optional rollout actions
```

---

### 3. Core Components

- **UI / API Layer:** Experiment wizard, monitoring, rollback controls.
- **LLM layer:** Proposal + narrative agent with schema-bound outputs.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** Splitter SDK, catalog, inventory, warehouse SQL APIs.
- **Memory / RAG:** Prior experiment summaries; policy snippets.
- **Data sources:** Orders, sessions, returns, margin tables.

---

### 4. Data Flow

1. **Input:** Merchant requests candidates for SKU set under constraints.
2. **Processing:** Agent queries historical elasticity proxies (careful methodology); proposes discrete price arms.
3. **Tool usage:** Validate against inventory and MAP rules; create experiment in shadow or live mode per flag.
4. **Output:** Dashboard updates; auto-stop if guardrails trip; post-stop report generated.

---

### 5. Agent Interaction (if applicable)

Single agent. **Stats** computed in warehouse/SQL engine, not by LLM arithmetic.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless assignment at edge; async aggregation jobs; shard experiments by shop.
- **Caching:** Precomputed SKU metrics snapshots per day for agent reads.
- **Async processing:** Nightly result rollups; anomaly detection jobs.

---

### 7. Failure Handling

- **Retries:** Warehouse query retries; experiment creation retries with idempotency keys.
- **Fallbacks:** Auto-disable variant traffic on inventory shortfall webhook.
- **Validation:** Reject overlapping experiments; enforce minimum traffic for power.

---

### 8. Observability

- **Logging:** Assignment counts, guardrail triggers, config diffs (no raw customer rows).
- **Tracing:** Trace `experiment_id` through assignment and reporting paths.
- **Metrics:** Uplift CIs, SRM alerts, margin impact, stockout correlation, agent suggestion acceptance rate.
