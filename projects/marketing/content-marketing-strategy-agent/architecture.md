### 1. System Overview

**Planning BFF** accepts goals and constraints. **Strategy Agent** queries **keyword**, **crawl**, and **roadmap** tools. **Validator** checks cannibalization and policy flags. **Export adapters** write to PM/CMS systems and store versioned plans in **Postgres**.

---

### 2. Architecture Diagram (text-based)

```
Goals → Strategy Agent → SEO/roadmap tools
        ↓
Calendar JSON → lint → Notion/Jira/CSV
```

---

### 3. Core Components

- **UI / API Layer:** Calendar editor, diff vs prior quarter, approvals.
- **LLM layer:** Tool-using agent with structured calendar schema.
- **Agents (if any):** Single agent baseline.
- **Tools / Integrations:** GSC, keyword vendors, sitemap fetcher, roadmap API.
- **Memory / RAG:** Brand + SEO playbook index; performance-weighted topic memory.
- **Data sources:** Analytics aggregates, backlog epics, competitor SERP captures (ToS).

---

### 4. Data Flow

1. **Input:** Quarter, regions, capacity, KPI weights.
2. **Processing:** Cluster keywords; map to pillars; attach owners and CTAs.
3. **Tool usage:** Validate URLs not conflicting; attach KD/volume snapshots to items.
4. **Output:** Persist `plan_vN`; notify stakeholders.

---

### 5. Agent Interaction (if applicable)

Single agent per planning session; human publishes schedule of record.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async plan generation for large portfolios; cache vendor responses.
- **Caching:** Keyword metrics by `(locale, seed)` key TTL daily.
- **Async processing:** SERP capture jobs decoupled from interactive planning.

---

### 7. Failure Handling

- **Retries:** Vendor API backoff; degrade to last cached metrics with staleness tag.
- **Fallbacks:** If LLM down, export keyword table + empty outlines for humans.
- **Validation:** Reject items missing owners or dates when required fields enforced.

---

### 8. Observability

- **Logging:** Tool error taxonomy, rows planned, export outcomes.
- **Tracing:** Plan generation latency breakdown.
- **Metrics:** Organic traffic delta by cluster, rework rate, API cost per plan.
