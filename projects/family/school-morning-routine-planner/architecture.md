### 1. System Overview
**Household** has children profiles, schools, and transport modes. **Scheduler** materializes a timeline per weekday. **Notification worker** fires step events with idempotency keys.

### 2. Architecture Diagram (text-based)
```
Calendar/weather → routine agent → timeline JSON
                         ↓
                 push worker → devices (parent-gated)
```

### 3. Core Components
ICS parser, timezone service, reminder templates, feedback capture, audit of what was shown to whom

### 4. Data Flow
Evening job precomputes tomorrow → morning micro-adjustments for weather → stream notifications → record actual vs planned step times

### 5. Agent Interaction
Agent updates only draft plans until parent approves weekly template changes; emergency “late wake” button recomputes once

### 6. Scaling Considerations
Many households; burst at 6–8am local—shard by TZ; coalesce notifications for same parent device

### 7. Failure Scenarios
Calendar fetch fail → use last known + banner; double push from retry → dedupe keys; child sick day → one-tap disable pattern

### 8. Observability Considerations
Notification volume per household, snooze patterns, on-time proxy metrics, agent edit frequency
