### 1. System Overview

**Feature service** maintains daily **account feature vectors** in the warehouse. **Journey Agent** runs **controlled SQL/tools** to fetch vectors + recent qualitative signals (tickets). **Explainer** produces narrative tied to numeric drivers. **CRM writer** optional stage applies updates with policy.

---

### 2. Architecture Diagram (text-based)

```
Analyst / CS system → BFF → Journey Agent
        ↓
Warehouse + CRM read tools
        ↓
Risk brief JSON → UI / optional CRM write (gated)
```

---

### 3. Core Components

- **UI / API Layer:** Account brief pages, cohort explorer, model registry UI.
- **LLM layer:** Tool-using agent; structured output schema for scores + drivers.
- **Agents (if any):** Single agent; optional writer split later.
- **Tools / Integrations:** dbt-exposed tables, CRM APIs, ticket search, NPS warehouse.
- **Memory / RAG:** Playbook snippets; prior human edits to briefs as few-shot.
- **Data sources:** Product events, billing, support, surveys.

---

### 4. Data Flow

1. **Input:** Authenticate analyst; resolve account id and entitlements.
2. **Processing:** Pull latest feature snapshot; if missing, compute on demand with caps.
3. **Tool usage:** Fetch top tickets themes via search tool; attach as qualitative layer.
4. **Output:** Render brief; log evidence tables hash for audit.

---

### 5. Agent Interaction (if applicable)

Single agent per request; batch scoring runs offline without LLM if configured.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Precompute features; agent reads narrow tables.
- **Caching:** Per-account brief cache with TTL tied to ETL freshness.
- **Async processing:** Weekly cohort scoring jobs for proactive lists.

---

### 7. Failure Handling

- **Retries:** Query retries with backoff; circuit break warehouse overload.
- **Fallbacks:** Degrade to last-known-good snapshot with staleness banner.
- **Validation:** Schema validate score outputs; clamp to policy min/max tiers.

---

### 8. Observability

- **Logging:** Feature version ids, tool timings, refusal reasons.
- **Tracing:** Brief generation spans tagged by `account_id` (authorized).
- **Metrics:** Override rate, downstream retention impact A/B, query cost per brief.
