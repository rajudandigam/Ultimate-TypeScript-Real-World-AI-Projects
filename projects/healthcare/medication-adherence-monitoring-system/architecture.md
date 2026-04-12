### 1. System Overview

Pharmacy and device producers publish **normalized dose events** into an **ingest API**. A **workflow engine** materializes **per-patient schedules**, computes **window states** (on-time / late / missed), drives **notification workers**, and writes **read-model aggregates** for dashboards. **Consent service** gates every outbound channel.

---

### 2. Architecture Diagram (text-based)

```
Sources (pharmacy / IoT / app) → ingest API → event bus
        ↓
Workflow: schedule + window engine
        ↓
Notification workers (SMS/push/voice)
        ↓
Receipts + adherence aggregates + audit
```

---

### 3. Core Components

- **UI / API Layer:** Patient app (optional), clinician console, admin ingestion monitors.
- **LLM layer:** Optional template copy assistant (strict allowlist); not on scheduling hot path.
- **Agents (if any):** None in v1 core; optional staff summarization agent later.
- **Tools / Integrations:** Twilio (or equivalent), push gateways, EHR read adapters.
- **Memory / RAG:** Postgres schedules + event log; Redis optional for rate counters.
- **Data sources:** HL7/FHIR dispense, device webhooks, patient self-report.

---

### 4. Data Flow

1. **Input:** Ingest `event_id`-keyed rows (idempotent).
2. **Processing:** Upsert medication schedule version; recompute next windows.
3. **Tool usage:** Send reminder when window opens/closes; record delivery receipt.
4. **Output:** Update streak metrics; enqueue clinician task if policy thresholds trip.

---

### 5. Agent Interaction (if applicable)

Not applicable for core adherence automation. If added, agents are **read-only** on metrics and **cannot** alter pharmacy orders.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workflows by `patient_id` hash; isolate noisy tenants.
- **Caching:** Hot read models for dashboards; invalidate on new events.
- **Async processing:** All notifications async; backpressure on provider rate limits.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on provider 5xx; cap attempts then DLQ with alert.
- **Fallbacks:** Secondary channel if primary fails (policy permitting).
- **Validation:** Reject events with impossible timestamps; quarantine malformed HL7.

---

### 8. Observability

- **Logging:** Structured logs with `tenant_id`, `schedule_version`, redacted phone tokens.
- **Tracing:** Trace ingest → schedule update → send for SLO debugging.
- **Metrics:** Missed-window precision in pilots, p95 reminder latency, opt-out rate, integration lag.
