### 1. System Overview
**Data ingest** from WMS → **slotting optimizer** → **simulation** → **Layout Agent** packages recommendations with metrics tables → **change management** workflow applies staged updates.

### 2. Architecture Diagram (text-based)
```
WMS snapshot → optimizer → simulation
        ↓
Agent narrative + rollout plan → ops approval → WMS tasks
```

### 3. Core Components
ETL, digital twin (optional), optimizer service, sim worker, agent BFF, approval UI, audit

### 4. Data Flow
Extract SKU profiles → propose moves in batches → simulate pick waves → score KPIs → export move list with dependencies

### 5. Agent Interaction
Single agent; metrics from sim binary, not LLM math

### 6. Scaling Considerations
Partition by zone; nightly full recompute; incremental intraday for hot SKUs

### 7. Failure Handling
Sim divergence triggers human recalibration; block export if master data QC fails

### 8. Observability
Travel distance estimates, pick rate before/after, incident reports near changed aisles
