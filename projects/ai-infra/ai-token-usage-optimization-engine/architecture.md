### 1. System Overview

Usage events flow into a **warehouse** for rollups. **Policy jobs** compare spend vs budgets. **Optimization workflows** propose changes via **eval-gated PRs** or **feature flag** adjustments. Runtime **gateway** enforces caps and cache keys.

---

### 2. Architecture Diagram (text-based)

```
LLM traffic → Gateway (emit usage events)
        ↓
   Stream ingest → warehouse rollups
        ↓
   Budget / anomaly detectors
        ↓
   Optimization workflow
     ↙        ↘
 eval runner   PR / flag tools
        ↓
   Approved config versions → gateway reload
```

---

### 3. Core Components

- **UI / API Layer:** Budget admin, savings reports, canary controls.
- **LLM layer:** Offline optimizer agent only.
- **Agents (if any):** Optimizer agent with tool access to eval + git + flags.
- **Tools / Integrations:** Warehouse SQL, CI eval APIs, Git provider, feature flag service.
- **Memory / RAG:** Prior optimization cases for retrieval-augmented proposals.
- **Data sources:** OTLP usage attributes, invoice data, eval scorecards.

---

### 4. Data Flow

1. **Input:** Ingest per-request token counts with route/model/version dimensions.
2. **Processing:** Aggregate hourly/daily; detect anomalies vs baseline; enqueue optimization if sustained overrun.
3. **Tool usage:** Pull eval results for candidate patch; open PR if thresholds pass human/CI gates.
4. **Output:** Publish new prompt version pointer or adjust routing weights within safe bounds.

---

### 5. Agent Interaction (if applicable)

Optimizer agent is **offline** and **tool-gated**; runtime remains deterministic.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Separate ingest from interactive optimization workers; partition warehouse by tenant.
- **Caching:** Response caches only where policy allows; version keys include prompt hash.
- **Async processing:** All optimization and heavy SQL async.

---

### 7. Failure Handling

- **Retries:** Warehouse query retries; rollback feature flags on SLO regression detectors.
- **Fallbacks:** Revert PR automatically if canary metrics breach thresholds.
- **Validation:** Schema validation for config patches; deny edits to safety-critical templates without extra approval.

---

### 8. Observability

- **Logging:** Optimization job ids, eval hashes, merged commit shas.
- **Tracing:** Trace optimization workflows; link to gateway config version deployments.
- **Metrics:** Spend per route, savings realized, cache hit rate, quality SLO after changes.
