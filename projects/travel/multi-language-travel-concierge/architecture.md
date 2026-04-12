### 1. System Overview

Clients connect to a **BFF** that resolves **user**, **active trip**, and **locale**. **Session store** holds short-term turns; **trip store** holds canonical facts (UTC, IDs). The **concierge agent** calls tools and updates **summary checkpoints** for long threads. Optional **voice path** streams audio through ASR/TTS adapters.

---

### 2. Architecture Diagram (text-based)

```
Client (chat / voice)
        ↓
   Concierge BFF (auth)
        ↓
   Session + trip stores (Redis/Postgres)
        ↓
   Concierge Agent (tools: bookings, status, KB)
        ↓
   Localized response + UI actions
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, voice client, handoff to human agent desk.
- **LLM layer:** Multilingual agent with structured internal state.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** OTA/airline/hotel APIs, maps, translation glossaries (deterministic where possible).
- **Memory / RAG:** Trip summaries; KB retrieval scoped by product and locale.
- **Data sources:** Booking systems, operational feeds, curated destination content.

---

### 4. Data Flow

1. **Input:** User message + `locale` + `trip_id` binding from auth context.
2. **Processing:** Load trip summary; retrieve KB chunks filtered by destination and topic.
3. **Tool usage:** Fetch live status or policy facts; merge into updated canonical trip JSON.
4. **Output:** Generate localized answer referencing tool timestamps; persist new summary checkpoint.

---

### 5. Agent Interaction (if applicable)

Single agent. Human support receives **structured handoff** JSON, not raw opaque chat only.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; sticky sessions or encrypted session cookies; shard Redis by tenant.
- **Caching:** KB chunk caches per `(locale, version)`; booking reads with short TTL.
- **Async processing:** Offline translation QA jobs for content teams.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; user-visible staleness if data old.
- **Fallbacks:** Template responses if model unavailable; offer human handoff.
- **Validation:** Reject tool outputs that fail schema; never merge conflicting flight IDs silently.

---

### 8. Observability

- **Logging:** Turn metadata, tool latency, locale, handoff triggers (redacted content).
- **Tracing:** Trace `session_id` / `trip_id` through BFF and agent.
- **Metrics:** Containment rate by locale, average tools per turn, summary truncation rate, ASR WER (voice mode).
