### 1. System Overview

Each **trip workspace** stores travelers, roles, budgets, and constraints. **Workflow** drives phases: collect prefs → propose options → vote → hold → pay → confirm. **Participant agents** read structured prefs; **scheduler** proposes feasible option sets; **booking sync** executes holds/commits via APIs. **Supervisor** merges outputs and enforces deadlines.

---

### 2. Architecture Diagram (text-based)

```
Trip workspace UI
        ↓
   Group coordination API
        ↓
   Phase workflow (Temporal/Inngest)
        ↓
   Supervisor
   ↙     ↓      ↘
Prefs   Scheduler  BookingSync
agents   agent       agent
        ↓
   Holds / bookings / payments
        ↓
   Notifications + audit log
```

---

### 3. Core Components

- **UI / API Layer:** Invites, polls, itinerary editor, payment status.
- **LLM layer:** Multi-agent reasoning with structured votes and constraints.
- **Agents (if any):** Per-traveler preference agents (often templated), scheduler, booking sync.
- **Tools / Integrations:** OTA/GDS or direct hotel APIs, payments, email/SMS.
- **Memory / RAG:** Trip state; optional KB for destination logistics.
- **Data sources:** User profiles, inventory feeds, payment processor events.

---

### 4. Data Flow

1. **Input:** Travelers submit structured constraints; optional free-text notes parsed into fields.
2. **Processing:** Scheduler generates candidate packages scoring group fit; vote round collects approvals.
3. **Tool usage:** Booking sync places holds then confirms after payment success webhook.
4. **Output:** Final artifacts + per-user cost allocation + calendar invites.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves ties (predeclared tie-breakers: leader veto, majority, or min-max fairness), caps negotiation rounds, and blocks proposals that violate hard constraints.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition by `trip_id`; async heavy booking calls; rate-limit external APIs per partner.
- **Caching:** Short-lived availability snapshots keyed by search fingerprint.
- **Async processing:** Payment webhooks and post-booking tasks decoupled from chat path.

---

### 7. Failure Handling

- **Retries:** Booking API retries with idempotency keys; never double-charge—use payment intents state machine.
- **Fallbacks:** If automation fails, package context for human travel agent handoff.
- **Validation:** Validate vote quorums before any non-refundable purchase.

---

### 8. Observability

- **Logging:** Phase transitions, hold IDs, payment intents, agent proposals (structured).
- **Tracing:** Trace `trip_id` across workflow and external APIs.
- **Metrics:** Time-to-decision, hold expiry rate, payment failure rate, user drop-off by phase.
