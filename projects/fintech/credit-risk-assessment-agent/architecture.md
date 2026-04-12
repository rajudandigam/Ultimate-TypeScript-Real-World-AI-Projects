### 1. System Overview

Loan applications land in **LOS** or a dedicated **application API**. A **feature pipeline** computes and stores **model inputs** with versioning. **Scorecard service** returns probabilities and reason codes. **Risk agent** composes memos and suggested LOS updates. **Compliance logger** captures prompts/outputs samples for review policies.

---

### 2. Architecture Diagram (text-based)

```
LOS / application intake
        ↓
   Feature pipeline → feature store (Postgres)
        ↓
   Scorecard / model service
        ↓
   Credit Risk Agent (tools: facts, policies, LOS)
        ↓
   Human underwriter review → final decision
```

---

### 3. Core Components

- **UI / API Layer:** Underwriter console, applicant status (non-sensitive), admin model registry.
- **LLM layer:** Memo and letter drafting agent with strict grounding rules.
- **Agents (if any):** Single agent per application session.
- **Tools / Integrations:** Bureau, income verification, fraud, LOS read/write (scoped).
- **Memory / RAG:** Policy manuals and product guides with citations.
- **Data sources:** Application forms, documents, third-party verifications.

---

### 4. Data Flow

1. **Input:** Ingest application package; normalize and validate schema.
2. **Processing:** Compute features; run scorecard; evaluate policy rules engine.
3. **Tool usage:** Agent reads structured results; may fetch additional clarifying facts via approved tools only.
4. **Output:** Draft memo + suggested next steps; human approves; system posts decision to LOS and triggers disclosures.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional future **fraud** sub-agent is isolated with different data access and audit policy.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async document processing workers; model service autoscaling.
- **Caching:** Feature snapshots keyed by `application_id` + `pipeline_version`.
- **Async processing:** Large PDF extraction pipelines decoupled from interactive memo generation.

---

### 7. Failure Handling

- **Retries:** Vendor calls with backoff; partial packages flagged incomplete.
- **Fallbacks:** If LLM unavailable, ship scorecard-only output with static templates.
- **Validation:** Schema validation on LOS writes; dual control for counteroffers above thresholds.

---

### 8. Observability

- **Logging:** Model version, rule hits, tool latency, human override reasons (structured).
- **Tracing:** Trace `application_id` through pipeline with PII controls.
- **Metrics:** Decision turnaround time, auto-STP rate, override rate, memo correction frequency, fairness metrics (where legally/ethically implemented).
