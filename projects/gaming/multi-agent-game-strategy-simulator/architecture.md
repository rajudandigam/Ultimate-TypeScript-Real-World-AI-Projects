### 1. System Overview

A **match runner** schedules games between N agents. Each turn, agents receive **observations** from the **rules engine** (never raw hidden info unless rules allow). Agents return **move intents** validated by engine. **Post-processors** compute stats and store **replays**. A **judge** service flags anomalies (illegal move spam, stalling).

---

### 2. Architecture Diagram (text-based)

```
Tournament scheduler
        ↓
   Match workers (parallel)
        ↓
   Rules engine (deterministic)
   ↑         ↓
   Agents A…N (LLM policies + tools)
        ↓
   Replay + metrics store
        ↓
   Reporting UI / APIs
```

---

### 3. Core Components

- **UI / API Layer:** Configure leagues, inspect replays, compare patches.
- **LLM layer:** Competing agents with tool access to sim APIs.
- **Agents (if any):** Multiple strategy agents; optional “breaker” adversary agent.
- **Tools / Integrations:** Legal move enumeration, branch sim, feature extraction.
- **Memory / RAG:** Patch-note retrieval for conditioned playtests.
- **Data sources:** Rules JSON, card/unit definitions, prior tournament archives.

---

### 4. Data Flow

1. **Input:** Load patch + seed + agent roster.
2. **Processing:** Run turn loop until terminal; each agent queries tools under budgets.
3. **Tool usage:** Agents request legal moves and evaluate branches; engine returns outcomes.
4. **Output:** Persist replay, ELO updates, exploit candidates for human review.

---

### 5. Agent Interaction (if applicable)

Agents **compete** within shared environment state. Optional **negotiation** phases (diplomacy-style games) add messaging channels with moderation and commitment binding via engine rules.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Elastic match worker pool; shard tournaments by ruleset version.
- **Caching:** Transposition table for classical evaluators; memoize frequent subpositions if applicable.
- **Async processing:** Batch overnight leagues; stream partial results to dashboards.

---

### 7. Failure Handling

- **Timeouts:** Forfeit turn or fallback random legal move policy (configurable) with audit flag.
- **Fallbacks:** Switch agent to scripted policy on repeated failures.
- **Validation:** Engine is sole authority; discard malformed intents.

---

### 8. Observability

- **Logging:** Turn durations, tool usage histograms, illegal attempt counts.
- **Tracing:** Trace `match_id` across workers and model calls.
- **Metrics:** Win matrix heatmaps, meta entropy, cost per match, provider error rates.
