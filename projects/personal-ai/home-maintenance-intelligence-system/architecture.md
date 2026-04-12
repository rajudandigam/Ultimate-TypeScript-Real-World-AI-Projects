### 1. System Overview
**Home graph** models assets, edges (e.g., HVAC serves zones), and documents. **Scheduler** emits due events. **Agent** consumes graph snapshot + recent telemetry to produce monthly brief.

### 2. Architecture Diagram (text-based)
```
Assets/docs → graph DB → maintenance agent → ranked actions
                    ↓
              reminders + completion capture
```

### 3. Core Components
Upload pipeline, OCR for receipts, rules catalog (versioned), notification channels, mobile offline cache, audit log of advice given

### 4. Data Flow
Nightly job recomputes due scores → agent generates digest if delta > threshold → user snoozes or completes → feedback updates model params

### 5. Agent Interaction
Read-only on financial accounts; write tools limited to creating reminders/tickets; no auto-booking contractors without explicit user tool approval

### 6. Scaling Considerations
Many homes per user (landlord); large photo sets; batch digest generation off-peak; compress old telemetry

### 7. Failure Scenarios
Missing last service date → widen confidence + ask one clarifying question; duplicate assets from import → dedupe wizard; sensor offline → degrade gracefully

### 8. Observability Considerations
Snooze rate, completion latency, alert volume per home, OCR fix-ups, agent suggestion acceptance rate
