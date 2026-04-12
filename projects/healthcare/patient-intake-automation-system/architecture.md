### 1. System Overview
Intake events → **workflow** → OCR/validate → **EHR gateway** → audit.

### 2. Architecture Diagram (text-based)
```
Form/OCR → workflow → rules + eligibility
        ↓
   FHIR API → EHR
        ↓
   Exception queue → staff UI
```

### 3. Core Components
Capture UI, workflow engine, validation services, EHR adapter, audit store, secrets.

### 4. Data Flow
Submit → validate schema → map to FHIR → POST with idempotency → ack/retry.

### 5. Agent Interaction
Optional LLM for **patient-facing** plain-language form help—not PHI classification authority without review.

### 6. Scaling Considerations
Per-site queues; burst handling for flu season; read replicas for reporting.

### 7. Failure Handling
DLQ; manual rollback procedures; never duplicate Coverage creates without keys.

### 8. Observability
Stage latency, error codes, PHI-safe metrics, integration health.
