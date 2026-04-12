### 1. System Overview

**Artifact ingester** stores benchmark JSON and metadata. **Normalizer** maps names to canonical scenarios. **Baseline service** maintains rolling windows per branch class (main vs PR). **Regression workflow** runs statistical tests, optionally triggers **bisect** child workflows, and posts results to GitHub Checks.

---

### 2. Architecture Diagram (text-based)

```
CI metrics → warehouse → compare workflow
        ↓
Decision + PR annotation
        ↘ bisect workflow (optional)
```

---

### 3. Core Components

- **UI / API Layer:** Dashboard for historical trends, flake management UI.
- **LLM layer:** Optional weekly digest generator.
- **Agents (if any):** Optional bisect planner later.
- **Tools / Integrations:** GitHub Checks API, tracing backends, bundle analyzers.
- **Memory / RAG:** Metric warehouse; PR metadata index.
- **Data sources:** k6 outputs, LHCI, microbench harnesses, OTel exports.

---

### 4. Data Flow

1. **Input:** CI posts metrics bundle after scenario run completes.
2. **Processing:** Join with baseline window; compute deltas and p-values / robust estimators.
3. **Tool usage:** Fetch related PR files for attribution suggestions; not for numeric truth.
4. **Output:** Pass/fail signal + structured JSON attachment for humans.

---

### 5. Agent Interaction (if applicable)

Not required in v1; keep decisioning deterministic.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers for bisect; shard warehouse by service.
- **Caching:** Precomputed aggregates per hour for dashboards.
- **Async processing:** Deep comparisons deferred to avoid blocking small PR checks.

---

### 7. Failure Handling

- **Retries:** Upload retries; do not duplicate check runs—use idempotency keys.
- **Fallbacks:** If warehouse unavailable, store raw artifact to object storage and mark “delayed decision.”
- **Validation:** Reject malformed metric names; enforce unit dimensions.

---

### 8. Observability

- **Logging:** Decision reasons with versioned policy pack id.
- **Tracing:** Ingest→compare spans; bisect depth metrics.
- **Metrics:** False positive/negative sampling results, CI minutes spent on bisect.
