### 1. System Overview
**Device registry** maps tags to animals and pastures. **Stream processor** computes features idempotently per window. **Alerting service** applies tiered policies and suppressions.

### 2. Architecture Diagram (text-based)
```
Sensors → ingest → feature windows → risk models → alerts
                         ↓
                   vet cases → outcomes → retrain
```

### 3. Core Components
Gateway auth, dead-letter queue for bad payloads, cold storage for raw traces, RBAC for farm staff vs vets, export to compliance PDFs

### 4. Data Flow
Uplink event → validate → append time series → on window close compute aggregates → score → if high risk open case → notify → collect follow-up vitals → close loop

### 5. Agent Interaction
Optional summarization offline; never on uplink hot path

### 6. Scaling Considerations
Millions of tag-day rows: partition by ranch; downsample high-rate accel; preaggregate nightly; burst during storms

### 7. Failure Modes
Clock drift on tags; mass gateway outage creating false “missing herd”—synthetic heartbeat checks, regional failover

### 8. Observability Considerations
Uplink lag, battery histograms, alert precision by species, case resolution latency, data gaps per device
