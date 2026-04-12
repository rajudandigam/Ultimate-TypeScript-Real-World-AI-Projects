### 1. System Overview
**Ingest bus** lands finance artifacts. **Line-item store** is normalized. **Ledger engine** posts signed emission journal entries. **Agent** assists mapping and narrative only.

### 2. Architecture Diagram (text-based)
```
Docs → parse → staging → mapping agent → human approve
                         ↓
                  ledger → disclosure export
```

### 3. Core Components
Factor version registry, org hierarchy resolver, approval workflow, seal service for closed periods, BI export to CSRD templates

### 4. Data Flow
Import batch → dedupe documents → extract rows → map to activity class → attach factor → compute kgCO₂e → balance check across scopes → publish

### 5. Agent Interaction
Read-only on sealed periods; write proposals go to staging tables; SQL tool SELECT-only in production paths

### 6. Scaling Strategy
Batch imports for large ERPs; incremental dbt runs; partition ledger by entity and period

### 7. Failure Modes
Currency conversion errors; duplicate invoice UUIDs; conflicting market-based energy certs—reconciliation jobs with explicit exception queues

### 8. Observability Considerations
Unmapped spend %, approval latency, factor version adoption, export job failures, restatement triggers
