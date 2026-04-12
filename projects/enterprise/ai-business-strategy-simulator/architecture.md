### 1. System Overview

Users configure an **initiative** with **assumption packages**. **Simulation engine** runs stochastic models producing **metric distributions**. **Multi-agent orchestrator** schedules rounds: **Exec**, **Finance**, **Product**, **Risk** agents propose arguments referencing tool outputs. **Facilitator** merges into a **structured report** artifact with **citations** to simulation tables.

---

### 2. Architecture Diagram (text-based)

```
Assumption UI → versioned package (Postgres)
        ↓
   Simulation worker(s)
        ↓
   Metrics artifacts (tables + charts)
        ↓
   Multi-agent rounds (role agents + critic)
        ↓
   Facilitator merge → report PDF/Markdown
```

---

### 3. Core Components

- **UI / API Layer:** Workshop mode, report viewer, permissions by initiative.
- **LLM layer:** Role agents + critic + facilitator summarization.
- **Agents (if any):** Exec, finance, product, risk, critic, facilitator (non-overlapping tools).
- **Tools / Integrations:** Simulation APIs, BI queries (read), export to Slides/Docs.
- **Memory / RAG:** Prior initiative retrospectives (ACL); research corpus retrieval.
- **Data sources:** Internal KPIs, market data feeds (licensed), user assumptions.

---

### 4. Data Flow

1. **Input:** Create initiative; lock assumption version; kick off baseline sim.
2. **Processing:** Agents read metrics; propose strategic options as structured objects referencing sim ids.
3. **Tool usage:** Additional sweeps requested via tools with pre-approved parameter bounds.
4. **Output:** Publish report with version pins; optional export to board workflow tools.

---

### 5. Agent Interaction (if applicable)

**Critic** challenges unsupported claims; **facilitator** enforces evidence rules and terminates rounds on convergence or budget.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue simulation jobs; separate inference pool for agent rounds; shard workspaces by org.
- **Caching:** Reuse simulation outputs for identical assumption hashes across sessions.
- **Async processing:** Long Monte Carlo paths offline; agents consume finished artifacts.

---

### 7. Failure Handling

- **Retries:** Simulation retries with smaller grids on failure; surface uncertainty explicitly.
- **Fallbacks:** If agents unhealthy, ship numbers-only report from templates.
- **Validation:** Reject agent-proposed parameter sweeps outside allowed ranges.

---

### 8. Observability

- **Logging:** Round counts, tool usage, simulation versions, export events (metadata).
- **Tracing:** Trace `initiative_id` through sim + agent phases.
- **Metrics:** Workshop completion rate, human edit rate on reports, cost per initiative, model/tool failure rates.
