### 1. System Overview
**Vault** stores encrypted user artifacts. **ETL** refreshes market snapshots on schedule. **Agent BFF** enforces per-request scopes and audit logging.

### 2. Architecture Diagram (text-based)
```
Imports → skill graph → coach agent → plan artifact
                    ↓
            calendar / reminders (optional)
```

### 3. Core Components
OAuth token vault, PII minimizer, content moderation, plan versioning, data export and deletion jobs

### 4. Data Flow
User authorizes import → normalize → embed chunks → agent queries tools → emits structured plan JSON → UI renders editable timeline → user commits version

### 5. Agent Interaction
Memory retrieval limited to user vault; no cross-user retrieval; tools must return dated metadata

### 6. Scaling Considerations
Many concurrent onboarding flows; cache public job stats by region; rate limit external APIs; async long imports

### 7. Failure Modes
Partial import; conflicting job titles; API outage—degrade to last snapshot with banner, block salary claims if data stale

### 8. Observability Considerations
Import success rate, tool latency, plan regeneration count, moderation triggers, support tickets tagged harmful bias
