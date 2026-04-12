### 1. System Overview

**Metrics builder** periodically snapshots issues, reviews, incidents, and PTO into **Postgres**. **Workload Agent** queries via tools and emits a **structured rebalance plan**. **Action gateway** applies writes only with **RBAC** and optional **dual approval**.

---

### 2. Architecture Diagram (text-based)

```
Trackers/CI/PD → metrics ETL → warehouse
        ↓
Workload Agent (read tools + optional write)
        ↓
Recommendations → human approve → tracker APIs
```

---

### 3. Core Components

- **UI / API Layer:** Team health dashboard, plan review UI, audit log.
- **LLM layer:** Tool-using agent for narrative + plan JSON.
- **Agents (if any):** Single agent baseline.
- **Tools / Integrations:** Linear/Jira/GitHub, PagerDuty, HRIS PTO (scoped).
- **Memory / RAG:** Policy/playbook retrieval; historical plans.
- **Data sources:** Issues, PR review requests, on-call schedules.

---

### 4. Data Flow

1. **Input:** Manager selects team + horizon (sprint/cycle).
2. **Processing:** Agent pulls aggregates and outliers with evidence tables.
3. **Tool usage:** Optionally simulate reassignment diff against WIP rules.
4. **Output:** Publish markdown plan; on approval enqueue write operations with idempotency keys.

---

### 5. Agent Interaction (if applicable)

Single agent; sensitive writes require human confirmation by default.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Precompute metrics; agent reads aggregates not raw giant lists.
- **Caching:** Snapshot per `(team_id, day)` for fast reload.
- **Async processing:** Heavy analysis jobs for large orgs.

---

### 7. Failure Handling

- **Retries:** API backoff; never duplicate assignment moves—use stable operation ids.
- **Fallbacks:** Read-only report if write scopes missing.
- **Validation:** Schema validate plan JSON; reject moves violating hard caps.

---

### 8. Observability

- **Logging:** Plan ids, metric versions, applied move counts.
- **Tracing:** Query→plan→approval spans.
- **Metrics:** Outlier coefficient variance over time, override rate, incident correlation post-change.
