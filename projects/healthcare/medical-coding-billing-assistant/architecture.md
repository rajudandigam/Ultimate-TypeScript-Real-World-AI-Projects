### 1. System Overview
Clinical docs → **NLP** → code candidates → **edit rules** → **coder UI** → export to billing.

### 2. Architecture Diagram (text-based)
```
EHR export → workflow
  → NLP engine
  → rules engine
  → coder review → billing export
```

### 3. Core Components
Ingest, de-id, model registry, rules engine, work queue, ERP/billing connector, audit.

### 4. Data Flow
Lock chart version → propose codes → coder accept/reject → immutable final package.

### 5. Agent Interaction
Optional LLM drafts **narrative queries** to coder—not payer submission authority.

### 6. Scaling Considerations
Queue by specialty; SLA dashboards; batch overnight processing.

### 7. Failure Handling
Low confidence → mandatory review; never auto-submit if policy forbids.

### 8. Observability
Denial reasons taxonomy, coder throughput, model version per encounter.
