### 1. System Overview
**Household model** stores ages, mobility, nap schedule, budgets. **Agent** produces **structured weekend JSON** consumed by UI components (timeline cards).

### 2. Architecture Diagram (text-based)
```
Profile → weekend agent → events / weather / drive tools
                  ↓
          plan JSON → calendar export + share link
```

### 3. Core Components
Preference store, tool adapters with caching, plan versioning, notification service for Friday evening nudges

### 4. Data Flow
Fetch weekend window → pull weather bands → query candidate POIs → prune by constraints → score diversity → attach backups

### 5. Agent Interaction
Single agent; mandatory final step validates JSON schema; invalid → self-repair once then fail soft with partial plan

### 6. Scaling Considerations
City-level cache of “top family POIs”; rate limit matrix API by household; burst traffic Friday afternoons

### 7. Failure Scenarios
All outdoor options rained out with no indoor quota → explicit failure message with user-prompted radius widen; API 429 → degraded static suggestions

### 8. Observability Considerations
Tool latency by provider, plan schema validation failures, backup activation rate, user edits per plan
