### 1. System Overview
Manager authZ → **Review Agent** → HRIS/PM tools (read) → **Draft JSON/Markdown** with `citation[]` → manager edit surface → optional export to HRIS review module

### 2. Architecture Diagram (text-based)
```
Manager → Agent → goals/feedback/shipping tools
        ↓
Draft review → human edit → HRIS (policy)
```

### 3. Core Components
AuthZ layer, agent BFF, redaction pipeline, audit log, HRIS adapters, model registry

### 4. Data Flow
Select review cycle + reportee → fetch allowed artifacts → generate sections → lint fairness/style → present diff UI

### 5. Agent Interaction
Single agent; ratings numeric fields out-of-scope for model write in v1

### 6. Scaling Considerations
Batch precompute summaries for large orgs async; cache PM artifacts per sprint with ACL

### 7. Failure Handling
Missing data sections marked TBD; never fabricate projects; escalate to HRBP queue

### 8. Observability
Generation counts, lint blocks, time-to-submit proxy, support tickets tagged to AI assist
