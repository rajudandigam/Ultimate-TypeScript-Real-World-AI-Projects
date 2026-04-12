### 1. System Overview
**Planning job** computes **recommended orders**. **Replenishment Agent** reads tables + exceptions and drafts **PO draft JSON**. **Approval workflow** enforces thresholds. **ERP adapter** posts approved POs.

### 2. Architecture Diagram (text-based)
```
Forecasts/on-hand → replenishment engine → line candidates
        ↓
Agent explain + risk flags → approval → ERP PO
```

### 3. Core Components
Inventory snapshot service, constraints DB, engine, agent BFF, approval inbox, ERP connector, audit

### 4. Data Flow
Pull OH+IT+PO pipeline → compute needs → split by supplier calendar → simulate cash impact → route to approvers if over cap

### 5. Agent Interaction
Single agent; quantities from engine, narrative cites line ids

### 6. Scaling Considerations
Batch by supplier; parallelize read-only queries; serialize writes per vendor account

### 7. Failure Handling
ERP timeout → mark PO pending reconcile; never duplicate if uncertain—query ERP state first

### 8. Observability
Auto vs manual PO ratio, receipt adherence, exception backlog, $ exposure dashboards
