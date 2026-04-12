### 1. System Overview

**Event bus** ingests normalized return/refund facts. **Feature pipeline** materializes graph-friendly aggregates. **Scoring workflow** attaches `risk_score`, `reason_codes[]`, and `model_version`. **Case service** routes to queues; **action adapters** place holds only through policy-gated APIs.

---

### 2. Architecture Diagram (text-based)

```
OMS/WMS events → ingest → feature store
        ↓
Scoring workflow → risk artifact
        ↓
Case queues → human actions → OMS updates
        ↘ optional LLM brief (structured facts only)
```

---

### 3. Core Components

- **UI / API Layer:** Investigator console, appeals portal hooks, admin model registry.
- **LLM layer:** Optional brief generator; never sole scorer in v1.
- **Agents (if any):** Optional later; start workflow-only.
- **Tools / Integrations:** Payments, carriers, device intel vendors (contractual).
- **Memory / RAG:** Feature store + policy doc retrieval for staff.
- **Data sources:** Orders, returns, CS transcripts metadata (redacted).

---

### 4. Data Flow

1. **Input:** `return_id` event triggers workflow instance.
2. **Processing:** Join order history, linked accounts, return reasons, timing anomalies.
3. **Tool usage:** Fetch latest tracking; write risk artifact idempotently.
4. **Output:** Route to tiered queue; emit webhooks to CX tools.

---

### 5. Agent Interaction (if applicable)

Optional investigator copilot reads **case packet** JSON only; cannot execute financial actions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by merchant_id; async scoring for peak season.
- **Caching:** Hot customer aggregates with TTL; invalidation on new events.
- **Async processing:** Nightly graph maintenance jobs separate from realtime scoring.

---

### 7. Failure Handling

- **Retries:** Vendor API backoff; never double-hold refunds—use idempotency keys.
- **Fallbacks:** If model unavailable, rules-only tier with conservative thresholds.
- **Validation:** Schema validation on all outbound actions; dual-control for bans.

---

### 8. Observability

- **Logging:** Decision lineage with model + ruleset versions.
- **Tracing:** Event→score→queue latency; stuck workflow detectors.
- **Metrics:** Precision@k on audits, appeal win rate, $ protected vs collateral damage estimates.
