### 1. System Overview
Recruiter UI → **Sourcing Agent** → internal + licensed external tools → **shortlist + draft outreach** → human approval → ATS/SEP actions logged.

### 2. Architecture Diagram (text-based)
```
Recruiter query → Agent → connectors (ATS/CRM/license APIs)
        ↓
Ranked candidates + citations → review → export
```

### 3. Core Components
UI/BFF, LLM tool layer, connector registry, vector index (internal), audit DB, webhook notifications

### 4. Data Flow
Parse job req → planned queries → fetch results → dedupe → score → package evidence → store run id

### 5. Agent Interaction
Single agent per session; send actions never autonomous without policy

### 6. Scaling Considerations
Shard by tenant; cache profile snapshots; async heavy similarity jobs

### 7. Failure Handling
Connector DLQ; partial results banner; circuit break abusive queries

### 8. Observability
Query latency, connector errors, human override rate, outreach reply metrics
