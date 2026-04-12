### 1. System Overview

Inbound messages arrive via **webhook** into an **ingestion normalizer** that extracts structured features without retaining full bodies unless policy allows. A **phishing agent** calls **intel tools** and emits a **schema-valid verdict**. **Policy engine** maps verdicts to actions (log, tag, quarantine). **Audit service** appends immutable events for compliance.

---

### 2. Architecture Diagram (text-based)

```
MTA / messaging webhook
        ↓
   Normalizer + feature extractor
        ↓
   Phishing Agent (tools: URL, DNS, intel)
        ↓
   Verdict schema validator
        ↓
   Policy engine → SIEM / quarantine API
        ↓
   Case store (redacted) + analyst UI
```

---

### 3. Core Components

- **UI / API Layer:** Analyst review, appeals, tenant policy editor.
- **LLM layer:** Classification agent with strict evidence binding.
- **Agents (if any):** Single primary agent; optional isolated parser worker.
- **Tools / Integrations:** URL expanders, reputation feeds, ticketing, SOAR.
- **Memory / RAG:** Closed-case retrieval with access controls.
- **Data sources:** Message metadata, sandbox results, tenant rules.

---

### 4. Data Flow

1. **Input:** Receive raw MIME or vendor JSON; compute hashes and structural features.
2. **Processing:** Run deterministic pre-score; if ambiguous, invoke agent with tool budget.
3. **Tool usage:** Expand URLs, query intel, fetch attachment metadata only.
4. **Output:** Persist verdict + evidence pointers; enqueue notifications; optional auto-action.

---

### 5. Agent Interaction (if applicable)

Single conversational agent for triage narrative; optional **non-LLM** extractor for MIME complexity.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingestion by tenant; scale agent workers independently.
- **Caching:** URL resolution cache with TTL; negative cache for benign domains (careful).
- **Async processing:** Heavy sandbox paths off the hot request path.

---

### 7. Failure Handling

- **Retries:** Webhook ack fast; async deep analysis with DLQ for poison messages.
- **Fallbacks:** Unknown → escalate to human when intel tools fail broadly.
- **Validation:** Reject verdicts missing minimum evidence for “malicious” label.

---

### 8. Observability

- **Logging:** Action outcomes, tool latency, redacted feature summaries.
- **Tracing:** End-to-end trace per `message_id` / `case_id`.
- **Metrics:** Precision proxy via analyst overrides, queue depth, time-to-triage.
