### 1. System Overview

The detector exposes a **Verify API** used by the LLM gateway or post-processor. It loads evidence references, runs **deterministic gates**, then optionally invokes a **verifier agent** with read-only tools. Results are **append-only audit events** consumed by analytics and product UI.

---

### 2. Architecture Diagram (text-based)

```
Draft answer + evidence bundle
        ↓
   Deterministic checks (citations, schema)
        ↓
   Verifier Agent (optional tools: fetchFact, calc)
        ↓
   Adjudicator (rules merge model + deterministic)
        ↓
   Verdict + UI annotations + OTel attrs
```

---

### 3. Core Components

- **UI / API Layer:** Reviewer tooling, threshold tuning, red-team replay console.
- **LLM layer:** Verifier model(s); separate from generator for blast-radius control.
- **Agents (if any):** Single verifier agent loop with strict tool allowlist.
- **Tools / Integrations:** Internal KB, calculator, read-only SQL with guardrails.
- **Memory / RAG:** Evidence chunks passed in by reference; optional calibration retrieval.
- **Data sources:** Retrieval store, tool traces, structured facts tables.

---

### 4. Data Flow

1. **Input:** Receive hashed bundle; validate integrity; reject if evidence missing for required claims policy.
2. **Processing:** Run citation checks; if pass, optionally run verifier with bounded steps.
3. **Tool usage:** Fetch extra snippets or numeric facts; append to evidence list with ids.
4. **Output:** Emit verdict JSON; propagate to client SDK for inline markers; log audit row.

---

### 5. Agent Interaction (if applicable)

Single verifier agent. Numeric/tool checks can be **non-LLM modules** invoked as tools for reliability.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless verifier fleet; cache evidence snippets by id for hot paths.
- **Caching:** Verdict cache keyed by `(answer_hash, evidence_hash, policy_version)` with short TTL where safe.
- **Async processing:** Async verification for low-risk surfaces; sync only where UX demands.

---

### 7. Failure Handling

- **Retries:** Limited retries on model timeouts; downgrade verdict with explicit uncertainty.
- **Fallbacks:** If verifier unavailable, apply stricter citation-only mode.
- **Validation:** Reject tool outputs not matching schema before feeding back to model.

---

### 8. Observability

- **Logging:** Verdict codes, latency breakdown, tool success flags.
- **Tracing:** Child span `verify` under user request span with linkage to retrieval index version.
- **Metrics:** Unsupported rate spikes, contradiction counts, human override rate.
