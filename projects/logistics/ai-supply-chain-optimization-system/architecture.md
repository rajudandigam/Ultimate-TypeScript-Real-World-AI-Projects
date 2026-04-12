### 1. System Overview

**Ingestion pipelines** normalize ERP/WMS/TMS signals into a **planning graph** (sites, SKUs, lanes, capacities). **Daily planning workflow** triggers **forecast refresh**, **inventory projection**, and **routing optimization** jobs. **Multi-agent layer** proposes exceptions and narratives. **Human approvals** gate purchase orders and carrier awards above thresholds.

---

### 2. Architecture Diagram (text-based)

```
ERP/WMS/TMS feeds
        ↓
   Planning data store (Postgres/Timescale)
        ↓
   Planning workflow (Temporal)
        ↓
   Supervisor
 ↙    ↓     ↘
Demand Inventory Routing
 agents   agents   agents
        ↓
   Solver + validators
        ↓
   Approved plan → execution APIs
```

---

### 3. Core Components

- **UI / API Layer:** Planner console, approvals, scenario comparison.
- **LLM layer:** Multi-agent proposals and explanations grounded in KPI JSON.
- **Agents (if any):** Demand, inventory, routing, supervisor.
- **Tools / Integrations:** Solver service, carrier APIs, PO creation, simulation backtest.
- **Memory / RAG:** SOP retrieval; disruption retrospectives.
- **Data sources:** Orders, shipments, inventory snapshots, weather, port congestion feeds (as needed).

---

### 4. Data Flow

1. **Input:** Scheduled tick or event (large order, delay) triggers planning run.
2. **Processing:** Agents read current state tools; propose constrained changes; supervisor merges.
3. **Tool usage:** Solver validates feasibility; routing tools compute costs with live tariffs where available.
4. **Output:** Publish plan version; enqueue actions; monitor execution feedback loop.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves conflicts (e.g., inventory agent vs routing cost), enforces KPI priorities configured by ops leadership.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by region or business unit; autoscale solver workers; separate hot read caches for telemetry.
- **Caching:** Lane cost matrices with TTL; warm-start files for solvers.
- **Async processing:** Long optimizations and simulations as background activities.

---

### 7. Failure Handling

- **Retries:** API retries with jitter; partial plans labeled infeasible with explicit missing inputs.
- **Fallbacks:** Revert to last approved plan on critical failures; notify on-call.
- **Validation:** Hard reject plans violating cold-chain or hazardous materials rules.

---

### 8. Observability

- **Logging:** Plan versions, solver status, approval outcomes, agent tool usage counts.
- **Tracing:** Trace `plan_run_id` across agents, solver, and execution.
- **Metrics:** Service level, inventory turns, expedite spend, forecast error, solver runtime distribution, data freshness SLOs.
