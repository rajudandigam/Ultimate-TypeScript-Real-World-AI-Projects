### 1. System Overview

A **hub service** maintains a **device graph** synced from Matter/Home Assistant adapters. Voice/text hits **intent API**, which calls the **home agent** to produce validated actions. A **policy engine** enforces restrictions before **command bus** publishes to devices. **Audit log** records all mutations.

---

### 2. Architecture Diagram (text-based)

```
Voice / app client
        ↓
   Hub API (auth)
        ↓
   Home Agent → proposed actions
        ↓
   Policy engine (time/presence/locks)
        ↓
   Command bus (MQTT/local)
        ↓
   Devices + state cache
```

---

### 3. Core Components

- **UI / API Layer:** Dashboard, routine editor, permission management.
- **LLM layer:** Planning agent with device tools.
- **Agents (if any):** Single agent; optional lock executor microservice.
- **Tools / Integrations:** Vendor bridges, weather, occupancy sensors.
- **Memory / RAG:** Preferences and learned schedules (user-controlled).
- **Data sources:** Local hub state, optional cloud enrichments.

---

### 4. Data Flow

1. **Input:** Parse utterance; attach home context snapshot (rooms, modes).
2. **Processing:** Agent proposes actions; simulator checks for conflicts (two sources of truth).
3. **Tool usage:** Read states; write through policy; confirm locks if required.
4. **Output:** Apply actions; update UI; record audit trail and rollback tokens where supported.

---

### 5. Agent Interaction (if applicable)

Single user-facing agent. Optional **energy** sub-planner as scheduled batch job, not interactive chat.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Mostly per-home hubs; cloud is coordination/OTA, not real-time control path.
- **Caching:** Device state snapshots; debounced sensor streams.
- **Async processing:** Heavy analytics (usage patterns) offline.

---

### 7. Failure Handling

- **Retries:** Device command retries with caps; detect offline devices quickly.
- **Fallbacks:** Degraded mode: suggest-only automations if execution disabled.
- **Validation:** Reject unknown device IDs; cap simultaneous large scene changes.

---

### 8. Observability

- **Logging:** Command outcomes, policy denials, hub resource usage.
- **Tracing:** Trace voice request → action (PII minimized).
- **Metrics:** Automation success rate, false trigger reports, hub offline minutes.
