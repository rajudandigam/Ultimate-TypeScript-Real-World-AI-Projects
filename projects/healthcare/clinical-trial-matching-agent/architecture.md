### 1. System Overview
Trial index + **rule engine** + **agent** for explanations; patient data stays in controlled store.

### 2. Architecture Diagram (text-based)
```
Patient FHIR summary (scoped)
        ↓
   Matching Agent → trial tools
        ↓
   Rule results + citations → UI
```

### 3. Core Components
Trial ETL, search API, rule engine, agent BFF, audit, consent service.

### 4. Data Flow
Fetch trials → evaluate each criterion → aggregate pass/fail → narrative with criterion ids.

### 5. Agent Interaction
Single agent; enrollment actions are out-of-scope for autonomous tools.

### 6. Scaling Considerations
Index sharding; cache popular trials; async batch for cohort screens.

### 7. Failure Handling
Missing data → “unknown” not guessed; human referral on low confidence.

### 8. Observability
Match funnel, tool errors, query latency, fairness monitoring metrics.
