### 1. System Overview
**Scheduled workflows** ingest supplier KPIs and external signals into **risk_mart**. **Scoring job** updates tiers. **Alert workflow** notifies owners with evidence links. **Action tracker** records mitigations.

### 2. Architecture Diagram (text-based)
```
ERP + external feeds → ETL → risk mart
        ↓
Score + alert → human workflow → audit
```

### 3. Core Components
Connector SDK, warehouse, rules+ML tier, notification bus, case management UI, governance approvals

### 4. Data Flow
Daily incremental → join to supplier golden record → compute tier delta → if crosses threshold open case

### 5. Agent Interaction
Optional LLM digest of `risk_event` tables only

### 6. Scaling Considerations
Shard by category; throttle external API calls; cache news with TTL

### 7. Failure Handling
Partial feed day → mark confidence down; never auto-block on single noisy source without corroboration policy

### 8. Observability
Feed lag, tier churn, false positive labels from buyers, time-to-mitigate
