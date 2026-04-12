### 1. System Overview

**OAuth gateway** stores refresh tokens per user with encryption. **Scheduling Agent** orchestrates **free/busy** fetches and **slot scoring**. **Policy engine** enforces org rules. **Invite service** creates drafts or sends events per automation level.

---

### 2. Architecture Diagram (text-based)

```
Client → BFF → Scheduling Agent
        ↓
Calendar APIs (Graph / Google) + policy DB
        ↓
Slot list / draft invite → user confirm
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, confirmation modal, admin policy console.
- **LLM layer:** Tool-using agent for slot search and explanation.
- **Agents (if any):** Single agent per scheduling session.
- **Tools / Integrations:** Microsoft Graph, Google Calendar, directory, HR calendars.
- **Memory / RAG:** Preference store; optional policy doc RAG.
- **Data sources:** Calendars, holidays, room resources (optional).

---

### 4. Data Flow

1. **Input:** Parse participants, duration, constraints from NL + structured form.
2. **Processing:** Parallel free/busy queries; normalize to UTC with attendee zones.
3. **Tool usage:** Score candidates; discard slots violating hard rules.
4. **Output:** Return ranked options; on confirm call write APIs with idempotency.

---

### 5. Agent Interaction (if applicable)

Single agent; human confirmation boundary for sensitive calendars.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; per-tenant token buckets for APIs.
- **Caching:** Free/busy snapshots with short TTL during active negotiation.
- **Async processing:** Large attendee lists resolved in background with progress UI.

---

### 7. Failure Handling

- **Retries:** 429 handling per provider guidelines.
- **Fallbacks:** Offer manual ICS attachment path if API write blocked.
- **Validation:** Attendee email normalization; block external domains per policy.

---

### 8. Observability

- **Logging:** Booking outcomes, policy violations attempted, model version.
- **Tracing:** Request→slots→confirm spans.
- **Metrics:** Time-to-schedule, reschedule rate, API quota headroom.
