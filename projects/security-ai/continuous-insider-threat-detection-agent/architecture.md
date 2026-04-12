### 1. System Overview
**Event bus** ingests normalized IAM, proxy, DLP, EDR, and app audit logs. **Identity graph** links accounts to assets. **Case service** owns lifecycle and legal holds.

### 2. Architecture Diagram (text-based)
```
Logs → features → risk scorer → cases
                    ↓
        insider agent (analyst assist) → SOAR / SIEM
```

### 3. Core Components
Entity resolution, watchlists, suppression calendars (maintenance windows), RBAC for analyst tiers, immutable evidence vault

### 4. Data Flow
Stream event → enrich user/asset → update windows → if score spike open or update case → agent proposes queries → analyst runs tools → disposition captured for retrain

### 5. Agent Interaction
Agent tools are read-only SIEM queries with parameterized templates; no delete/modify on source logs

### 6. Scaling Strategy
Shard by tenant; sample high-volume DNS/web; preaggregate per user-hour; burst handling during breach drills

### 7. Failure Modes
Delayed log shipping creates false sequences; duplicate identities after M&A—merge rules, clock skew monitors

### 8. Observability Considerations
Scoring latency, case backlog age, analyst override rate, data source freshness SLOs, cost per active user monitored
