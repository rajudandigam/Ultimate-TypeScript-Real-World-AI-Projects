### 1. System Overview
HRIS **hire event** triggers **Temporal workflow** with `employee_id`. Steps call **IT**, **LMS**, **facilities** adapters with retries and compensations. **Notification step** sends templated emails/Slack. **Audit** records completions.

### 2. Architecture Diagram (text-based)
```
HRIS webhook → onboarding workflow → IT/LMS tasks
        ↓
Reminders / escalations → completion proofs
```

### 3. Core Components
Event gateway, workflow engine, adapter SDK, secrets vault, admin UI, audit export

### 4. Data Flow
Validate hire payload → materialize task graph → execute with checkpoints → notify stakeholders → close when all gates green

### 5. Agent Interaction
Optional NL summarizer for hire coordinator digest—not on provisioning critical path

### 6. Scaling Considerations
Partition by region; bulk hire burst queues; idempotent external creates

### 7. Failure Handling
DLQ for failed provisioning; human task creation; safe rollback of partial IT access where supported

### 8. Observability
SLA per step, backlog depth, error taxonomy by adapter, hire cohort readiness %
