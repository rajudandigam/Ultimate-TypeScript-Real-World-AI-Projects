### 1. System Overview
**Workflow scheduler** triggers runs. **Context builder** gathers account metadata and last-known-good snapshots. **Agent** executes tool plan and emits **typed gap records**.

### 2. Architecture Diagram (text-based)
```
Schedule → inventory snapshot → posture agent → gaps
                                    ↓
                            ticketing + trend store
```

### 3. Core Components
Credential broker (OIDC), tool adapters, policy compiler, vector index over internal runbooks (optional), drift DB, notification service

### 4. Data Flow
Fetch configs → normalize to internal schema → diff vs policy → score severity → dedupe against open tasks → notify

### 5. Agent Interaction
Single agent per tenant-run; tools return JSON only; agent cannot bypass RBAC on secret backends

### 6. Scaling Challenges
API rate limits across hundreds of accounts; large resource graphs need pagination; parallelize by OU with fairness

### 7. Failure Handling
Partial account scan → mark degraded; tool timeout → retry with backoff; never drop raw evidence blobs

### 8. Observability Considerations
Per-cloud API quota usage, agent tool error taxonomy, gap creation rate, duplicate suppression ratio, human override rate
