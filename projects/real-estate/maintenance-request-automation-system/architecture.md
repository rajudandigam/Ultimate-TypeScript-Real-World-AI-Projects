### 1. System Overview
**Intake API** normalizes requests. **Classifier** (rules + optional LLM) assigns type/severity. **Routing workflow** selects vendor tier and creates WO in external system. **SLA timers** escalate until resolved with attachments.

### 2. Architecture Diagram (text-based)
```
Tenant → intake → classify → work order → vendor
        ↓
SLA / proof → close loop → tenant notify
```

### 3. Core Components
Portal UI, workflow engine, vendor adapters, file storage for photos, notification service, audit DB

### 4. Data Flow
Create ticket → assign → notify → receive updates webhook → verify completion → close → survey

### 5. Agent Interaction
Optional LLM classification only; execution remains workflow-driven

### 6. Scaling Considerations
Multi-property portfolios sharded by org; burst handling after storms

### 7. Failure Handling
Vendor reject → reassign pool; emergency override hotline bridge

### 8. Observability
Dispatch latency, SLA breaches, vendor performance scorecards, duplicate rate
