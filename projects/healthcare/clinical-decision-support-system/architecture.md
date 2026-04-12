### 1. System Overview
**EHR** emits CDS Hooks requests. **Context service** assembles FHIR bundles with **minimum necessary** data. **Agent** queries KB tools and returns **cards** (links, suggestions, warnings). **Telemetry** records dismissals and downstream orders.

### 2. Architecture Diagram (text-based)
```
EHR → CDS Hooks → context builder → CDS agent → cards
                         ↓
                 audit store ← clinician actions
```

### 3. Core Components
FHIR facade, terminology service (SNOMED/LOINC as licensed), guideline repository, card renderer, auth (OAuth2), rate limiter, offline fallback rules

### 4. Data Flow
Hook payload → normalize units/time zones → retrieve active problems/meds → run deterministic checks first → agent augments with evidence-linked text → return <200ms target or async card

### 5. Agent Interaction
Tools are read-only except `post_audit_event`; no autonomous orders without explicit human confirmation outside policy

### 6. Scaling Challenges
Large bundles; concurrent hooks per encounter; multi-site KB replication; multilingual guideline gaps

### 7. Failure Handling
KB timeout → return safe generic card with “insufficient evidence”; parse errors → degrade to rules-only path

### 8. Observability Considerations
Hook latency percentiles, card impression/accept rates, KB version per suggestion, error codes from FHIR server, drift in override reasons
