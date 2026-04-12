### 1. System Overview
Med list → **normalize** (RxNorm) → **interaction DB** → structured alerts → channels (EHR, SMS policy-gated).

### 2. Architecture Diagram (text-based)
```
Meds API → workflow
   → RxNorm map
   → interaction query
   → alert + audit
```

### 3. Core Components
Terminology service, interaction DB snapshot job, workflow, clinician API, audit.

### 4. Data Flow
Versioned DB load → live query with med pair keys → log result codes.

### 5. Agent Interaction
Optional patient education microservice with **no** new clinical facts.

### 6. Scaling Considerations
Read-heavy; cache hot pairs; horizontal API replicas.

### 7. Failure Handling
Unknown meds → escalate; never silent pass on parse failure.

### 8. Observability
Query latency, unknown code rate, DB version drift alerts.
