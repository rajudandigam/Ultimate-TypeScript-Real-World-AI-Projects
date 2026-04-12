### 1. System Overview
**SCADA historian** replication lands in a **lakehouse**. **Workflow orchestrator** schedules district jobs with idempotent keys. **GIS service** maps nodes/edges to street segments for dispatch.

### 2. Architecture Diagram (text-based)
```
SCADA/AMI → lakehouse → balance + anomaly workflows
                    ↓
           ranked leak candidates → CMMS / crew app
```

### 3. Core Components
PI/historian adapters (examples), network graph builder, model registry, mobile proof-capture app, audit log for regulatory inquiries

### 4. Data Flow
Pull interval readings → compute night minimum curves → detect sustained deviation → correlate neighbors → emit candidate edge list with confidence → human ack → valve ops if policy allows

### 5. Agent Interaction
None required; optional analyst LLM summarizes weekly top districts from aggregated metrics JSON

### 6. Scaling Considerations
Millions of meters: partition by DMA; incremental recomputation; preaggregate nightly; burst handling after storms

### 7. Failure Modes
Missing reads after firmware upgrade; DST bugs; GIS mismatch—topology diff alerts, replay jobs from checkpoint

### 8. Observability Considerations
Per-DMA anomaly rate, job backlog, crew confirmation latency, NRW KPI trend, data quality SLO per sensor class
