### 1. System Overview

**Scheduler** kicks nightly **forecast runs**. **ETL** ensures marts are fresh. **Forecasting Agent** queries **CRM + warehouse** tools and writes **scenario JSON** + narrative. **Artifact service** stores board pack versions with **hashes** for audit.

---

### 2. Architecture Diagram (text-based)

```
dbt marts → warehouse
        ↓
Forecasting Agent → CRM/SQL tools
        ↓
Scenario snapshot → Slack/email + BI embed
```

---

### 3. Core Components

- **UI / API Layer:** Assumption editor, approval for exec distribution, drill-down explorer.
- **LLM layer:** Tool-using agent; structured outputs for scenarios + drivers.
- **Agents (if any):** Single agent per run; optional finance copilot later.
- **Tools / Integrations:** Snowflake/BigQuery, Salesforce/HubSpot, attribution tables.
- **Memory / RDB:** `forecast_run` tables with immutable inputs snapshot.
- **Data sources:** Opportunities, activities, campaigns, historical closes.

---

### 4. Data Flow

1. **Input:** Trigger with `as_of` timestamp and segment definitions.
2. **Processing:** Pull pipeline snapshot; compute coverage ratios and velocity metrics.
3. **Tool usage:** Assemble best/base/worst scenarios with explicit assumption knobs.
4. **Output:** Persist artifacts; notify subscribers; optional write-back to CRM notes (policy).

---

### 5. Agent Interaction (if applicable)

Single agent; numbers always traceable to query ids stored alongside narrative.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async run workers; isolate heavy tenants.
- **Caching:** Precomputed cubes for common segment cuts.
- **Async processing:** Monte Carlo or simulations in worker tier if added.

---

### 7. Failure Handling

- **Retries:** Query retries with backoff; partial failure marks scenario incomplete.
- **Fallbacks:** Prior run remains “current” with banner if new run fails validation.
- **Validation:** Cross-check totals vs CRM UI exports on sample deals in CI for regressions.

---

### 8. Observability

- **Logging:** Run duration, rows scanned, model version, validation pass/fail.
- **Tracing:** ETL freshness → agent → artifact spans.
- **Metrics:** Forecast error vs actuals by segment, adoption of scenarios in meetings.
