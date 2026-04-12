### 1. System Overview

Telephony events enter a **workflow engine** that drives **authentication**, **intent routing**, and **post-call work**. A **voice runtime** bridges **media streams** to **ASR/LLM/TTS**. **Tool gateway** enforces scopes per workflow step. **QA pipeline** samples calls for review and continuous improvement.

---

### 2. Architecture Diagram (text-based)

```
PSTN/SIP → telephony platform
        ↓
   Call workflow (Temporal/Inngest)
        ↓
   Voice runtime (ASR ↔ Agent ↔ TTS)
        ↓
   Tool gateway → CRM / KB / billing (vaulted)
        ↓
   Disposition + QA + analytics
```

---

### 3. Core Components

- **UI / API Layer:** Supervisor console, bot tuning, QA review.
- **LLM layer:** Segment agents constrained by workflow state machine.
- **Agents (if any):** Primary voice agent; optional specialist subgraphs.
- **Tools / Integrations:** Ticketing, order management, scheduling, payment vault adapters.
- **Memory / RAG:** KB retrieval; call summary memory with retention controls.
- **Data sources:** Tenant KB, CRM records (PII gated), telephony metadata.

---

### 4. Data Flow

1. **Input:** Call starts; workflow selects language and authentication path.
2. **Processing:** ASR streams text; agent selects branch; may retrieve KB snippets with ACL checks.
3. **Tool usage:** Reads first; writes require workflow gates + step-up verification events.
4. **Output:** Spoken response; CRM updates; if needed, warm transfer packet to human agent.

---

### 5. Agent Interaction (if applicable)

Workflow is the “supervisor.” Within a step, a single agent reduces incoherence. Optional async **research** worker posts notes to the same conversation state (not a second customer voice).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless voice gateways; workflow workers separate from media-heavy nodes.
- **Caching:** KB chunk caches per tenant; avoid caching user-specific PII responses.
- **Async processing:** Post-call summarization, tagging, and survey outreach.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; user-visible stall handling (“still checking”).
- **Fallbacks:** Transfer to human on low confidence, repeated ASR failures, or compliance triggers.
- **Validation:** Schema validation on CRM writes; idempotency keys on financial actions.

---

### 8. Observability

- **Logging:** Dispositions, tool outcomes, redacted transcripts metadata, verification events.
- **Tracing:** Trace `call_id` across telephony, workflow, and model calls.
- **Metrics:** Containment rate, AHT delta, handoff latency, policy violations (target zero), ASR WER by noise bucket.
