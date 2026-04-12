### 1. System Overview

Disruption signals enter an **ingestion service** normalized to **incident records**. A **workflow engine** owns lifecycle: triage → propose → approve → execute → notify. **Detector**, **Rebooking**, and **Compensation** agents propose structured artifacts; a **policy service** and **human approval queue** gate side effects. **Executor** applies GDS/OTA commands with receipts.

---

### 2. Architecture Diagram (text-based)

```
Feeds / webhooks / polling
        ↓
   Incident normalizer → Postgres
        ↓
   Disruption workflow (Temporal/Inngest)
        ↓
   Supervisor dispatch
   ↙        ↓        ↘
Detector  Rebooker  Compensation
        ↓
   Approvals + policy checks
        ↓
   Executor → carrier/OTA APIs
        ↓
   CRM + notifications
```

---

### 3. Core Components

- **UI / API Layer:** Ops console, traveler status page, approval inbox.
- **LLM layer:** Multi-agent proposals over structured trip state.
- **Agents (if any):** Detector, rebooking optimizer, compensation/case agent.
- **Tools / Integrations:** Schedules, availability, ticketing, payments, messaging.
- **Memory / RAG:** Policy snippets and anonymized case patterns.
- **Data sources:** PNR snapshots, carrier messages, hotel channel manager events.

---

### 4. Data Flow

1. **Input:** Ingest raw change events; correlate to active bookings and travelers.
2. **Processing:** Detector classifies impact; rebooker searches constrained alternatives; compensation drafts eligible actions from rules.
3. **Tool usage:** Read-heavy first; writes only after approval tokens and idempotency keys.
4. **Output:** Update booking records, send comms, open/close support cases with audit trail.

---

### 5. Agent Interaction (if applicable)

A **supervisor** (workflow + optional LLM summarizer) merges agent outputs, resolves conflicts (e.g., cheapest vs policy-compliant), and enforces **stop** conditions (budget, blackout routes, VIP overrides).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard incident workers by tenant or region; isolate hot carriers during mass cancellations.
- **Caching:** Short-lived availability snapshots with explicit staleness timestamps.
- **Async processing:** Heavy multi-leg searches and batch notifications off the hot path.

---

### 7. Failure Handling

- **Retries:** API retries with jitter; never double-ticket—use idempotency keys and confirm-before-finalize.
- **Fallbacks:** Degrade to “human required” with prefilled context when automation confidence is low.
- **Validation:** Schema validation on all itinerary patches; fare basis and ticket number cross-checks.

---

### 8. Observability

- **Logging:** Incident state transitions, tool outcomes, approval decisions (metadata-first).
- **Tracing:** Trace `incident_id` across agents and executor.
- **Metrics:** Time-to-first-touch, auto-resolution rate, rebooking success rate, compensation error rate, API quota usage.
