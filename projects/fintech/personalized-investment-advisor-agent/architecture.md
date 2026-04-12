### 1. System Overview

Users complete **suitability capture** stored in **Postgres**. **Portfolio sync** pulls holdings (read-only). **Quant service** runs simulations and exposures. **Advisor agent** consumes structured outputs and **retrieved docs** to answer questions. **Compliance gate** logs disclosures and blocks restricted intents.

---

### 2. Architecture Diagram (text-based)

```
Client (questionnaire + chat)
        ↓
   Advisory BFF (auth + jurisdiction)
        ↓
   Quant engine (deterministic)
        ↓
   Advisor Agent (tools: holdings, sim, docs)
        ↓
   Compliance log + optional human queue
```

---

### 3. Core Components

- **UI / API Layer:** Disclosures, risk charts, adviser handoff.
- **LLM layer:** Advisory agent with strict citation and numeric grounding rules.
- **Agents (if any):** Single primary agent per session.
- **Tools / Integrations:** Broker APIs, market data, document store, PDF export.
- **Memory / RAG:** Prospectus and research index with ACLs and effective dates.
- **Data sources:** User profile, holdings snapshots, third-party fundamentals (licensed).

---

### 4. Data Flow

1. **Input:** User question plus latest `portfolio_snapshot_id` and `jurisdiction`.
2. **Processing:** Agent decides which tools to call; simulations run with versioned parameters.
3. **Tool usage:** Fetch holdings and doc chunks; never fabricate positions not in snapshot.
4. **Output:** Structured answer + citations + disclaimers; optional ticket to human adviser.

---

### 5. Agent Interaction (if applicable)

Single conversational agent. Optional **headless** batch job generates monthly client letters from templates (not multi-chat).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; async simulation workers; cache snapshots by hash.
- **Caching:** Simulation results keyed by inputs; doc retrieval caches per fund CIK/version.
- **Async processing:** Heavy Monte Carlo off the chat hot path with polling UI.

---

### 7. Failure Handling

- **Retries:** Market data retries; user-visible degradation if snapshot stale.
- **Fallbacks:** Refuse trade-like actions when compliance engine flags session.
- **Validation:** Schema validation on all tool outputs before model consumption.

---

### 8. Observability

- **Logging:** Tool call success, compliance blocks, disclosure acknowledgments (metadata).
- **Tracing:** Trace `session_id` through quant + agent with PII redaction.
- **Metrics:** Question categories, escalation rate, simulation runtime, model cost per user, policy violation attempts (should be ~0).
