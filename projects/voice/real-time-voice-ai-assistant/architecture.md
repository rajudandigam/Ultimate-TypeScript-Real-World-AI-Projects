### 1. System Overview

Clients open a **real-time session** to a **voice gateway** that manages **audio frames**, **VAD**, and **provider routing**. **ASR** streams partial transcripts to an **agent runtime** that may emit **tool calls** and **TTS audio chunks**. A **session state machine** handles **barge-in**, cancelling in-flight synthesis and stale tool results.

---

### 2. Architecture Diagram (text-based)

```
Client audio (WebRTC/ws)
        ↓
   Voice gateway (VAD + routing)
        ↓
   Streaming ASR → partial text
        ↓
   Voice Agent (tools + streaming tokens)
        ↓
   Streaming TTS → audio chunks
        ↓
   Client playback + barge-in events
```

---

### 3. Core Components

- **UI / API Layer:** Client SDK, optional telephony bridge.
- **LLM layer:** Streaming agent with tool execution and cancellation tokens.
- **Agents (if any):** Single conversational agent per session.
- **Tools / Integrations:** CRM, ticketing, calendars, search APIs.
- **Memory / RAG:** Session summary checkpoints; optional KB retrieval.
- **Data sources:** User-authorized backends; ephemeral audio buffers.

---

### 4. Data Flow

1. **Input:** Audio frames arrive; VAD detects speech start/stop; noise suppression optional.
2. **Processing:** ASR emits partials; agent decides clarify vs act; schedules tools with deadlines.
3. **Tool usage:** Tools return structured results; agent speaks concise confirmations.
4. **Output:** TTS streams; on barge-in, cancel playback and reset turn state safely.

---

### 5. Agent Interaction (if applicable)

Single agent for UX coherence. Optional **non-user-facing** router service chooses model tier—still one conversational thread.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless gateways with sticky sessions; autoscale TTS workers.
- **Caching:** Frequent FAQ retrieval caching per tenant (non-sensitive).
- **Async processing:** Post-call summarization async to avoid blocking real-time path.

---

### 7. Failure Handling

- **Retries:** ASR reconnect; LLM fallback model; TTS provider failover.
- **Fallbacks:** Switch to text chat mode if audio path unhealthy.
- **Validation:** Tool schema validation; block transfers without verified customer context policy.

---

### 8. Observability

- **Logging:** Session metadata, tool outcomes, barge-in counts (no raw audio by default).
- **Tracing:** Trace `session_id` across ASR/agent/TTS with redaction.
- **Metrics:** End-to-end latency percentiles, interruption success rate, abandonment funnel, provider SLA breaches.
