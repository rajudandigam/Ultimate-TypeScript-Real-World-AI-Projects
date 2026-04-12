### 1. System Overview
**Ingest plane** lands operational data into a **warehouse star schema**. **Factor service** versions emission coefficients. **Agent** queries pre-aggregates and explains drivers of change month-over-month.

### 2. Architecture Diagram (text-based)
```
Sources → ETL → carbon ledger → factor service
                     ↓
           sustainability agent → insights + initiatives
```

### 3. Core Components
Connector SDK, dbt jobs, metrics layer (Cube/Semantic), initiative PM integration, PDF exporter, audit trail

### 4. Data Flow
Define org boundary → map activities → select factors by geo/time → compute CO2e → attribute to cost centers → surface hotspots

### 5. Agent Interaction
Agent cannot alter ledger tables; only proposes SQL which passes static safety checks (SELECT-only)

### 6. Scaling Challenges
Sparse data in SMBs; multi-currency procurement; large travel datasets need PII minimization

### 7. Failure Handling
Missing factors → widen confidence interval; conflicting sources → flag for human reconciliation

### 8. Observability Considerations
Pipeline freshness, % activities mapped, agent query latency, human correction rate on narratives, factor version adoption
