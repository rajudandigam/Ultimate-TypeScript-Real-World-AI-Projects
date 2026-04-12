### 1. System Overview

The engine terminates TLS at the edge, maintains **upstream provider streams** with **linked cancellation**, and forwards **normalized events** to clients. A **sequence layer** assigns monotonic ids for resume. **Backpressure** is applied on slow clients to protect memory.

---

### 2. Architecture Diagram (text-based)

```
Client (SSE/WS)
        ↓
   Streaming gateway
        ↓
   Provider adapter (OpenAI-compatible stream)
        ↓
   Normalizer (tool-call JSON state machine)
        ↓
   Client event writer (buffered + flow control)
        ↓
   OTel + metrics
```

---

### 3. Core Components

- **UI / API Layer:** Client SDK, internal debug console.
- **LLM layer:** Upstream providers only.
- **Agents (if any):** None.
- **Tools / Integrations:** Optional blob store for large payloads referenced in stream.
- **Memory / RAG:** Minimal resume state with TTL; not a transcript archive by default.
- **Data sources:** Provider chunks; gateway-generated control frames.

---

### 4. Data Flow

1. **Input:** Client connects; gateway authenticates; opens upstream with mapped model/route.
2. **Processing:** Read upstream chunks; normalize to `StreamEvent`; update tool-call parser state machine.
3. **Tool usage:** N/A; tool calls are parsed, not executed here.
4. **Output:** Write events to client; on disconnect, cancel upstream; persist resume cursor if enabled.

---

### 5. Agent Interaction (if applicable)

Not applicable.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Sticky sessions or stateless gateways with external resume store; scale edge separately from origin.
- **Caching:** Avoid caching streams; cache static protocol docs only.
- **Async processing:** Optional async archival to object storage with strict consent.

---

### 7. Failure Handling

- **Retries:** Client-driven reconnect with resume cursor; upstream retries only for safe idempotent starts.
- **Fallbacks:** Switch to non-streaming mode for degraded providers if configured.
- **Validation:** Drop malformed provider chunks with metric; protect parser from unbounded growth.

---

### 8. Observability

- **Logging:** Sequence gaps, disconnect reasons, upstream error codes (no raw prompts).
- **Tracing:** Span `ai.stream` with events for first token, first tool delta, completion.
- **Metrics:** Open streams, bytes/sec, client lag, upstream cancel success rate.
