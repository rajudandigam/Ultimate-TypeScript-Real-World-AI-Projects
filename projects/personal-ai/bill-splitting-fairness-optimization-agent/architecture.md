### 1. System Overview
**Ledger service** is append-only with compensating entries. **Solver** recomputes settlements idempotently from cursor. **Agent** reads ledger snapshots only.

### 2. Architecture Diagram (text-based)
```
Expenses → ledger → solver → settlement graph
                 ↓
        fairness agent → human-readable summary
```

### 3. Core Components
Group workspace, permission model, FX cache, receipt OCR queue, export generator, dispute thread store

### 4. Data Flow
Add expense events → validate splits sum to 100% → recompute net balances → min transactions algorithm → present graph → user confirms payouts

### 5. Agent Interaction
Agent cannot alter settled periods without admin flag; tool mutations go through optimistic concurrency checks

### 6. Scaling Considerations
Large groups (30+) need sparse graph optimizations; long trips with thousands of line items need pagination in agent context

### 7. Failure Scenarios
Concurrent edits → version conflict UI; FX API down → freeze rates with banner; solver negative cycle (bad data) → block with diagnostic

### 8. Observability Considerations
Settlement recompute latency, dispute tags, OCR correction rate, export usage, agent token cost per closeout
