### 1. System Overview
**WMS connector** pulls dimensions/weights. **Model builder** constructs CP-SAT variables for item placements per orientation set. **UI** renders placements and violations live.

### 2. Architecture Diagram (text-based)
```
SKU + equipment → loading agent → solver → 3D plan
                        ↓
                 validate → export → WMS commit
```

### 3. Core Components
SKU normalization, hazmat matrix DB, solver autoscaler, versioned plans, diff viewer between revisions

### 4. Data Flow
Ingest order lines → dedupe packaging hierarchies → generate candidate orientations → solve → post-check physics heuristics (optional) → publish

### 5. Agent Interaction
Agent cannot mark plan valid if solver reports infeasible; manual UI edits re-invoke solver patch

### 6. Scaling Strategy
Decompose by container; warm-start from yesterday’s template; parallelize independent containers across workers

### 7. Failure Modes
Numeric instability in weights; missing dims default unsafe—block publish until measured or estimated with wide margin flagged

### 8. Observability Considerations
Solver status histogram, utilization KPIs, human override reasons, API sync failures, $ CPU per plan
