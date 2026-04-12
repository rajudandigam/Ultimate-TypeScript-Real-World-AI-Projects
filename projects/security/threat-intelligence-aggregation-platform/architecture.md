### 1. System Overview
**Ingress bus** lands raw objects. **Supervisor** schedules specialist agents. **Graph service** stores entities/edges with lineage. **Downstream** triggers SOAR webhooks under policy.

### 2. Architecture Diagram (text-based)
```
Feeds → normalizer agent → resolver agent → graph
                    ↓
        correlation agent → cases → SOAR (policy-gated)
```

### 3. Core Components
Connector SDK, schema registry, graph DB, vector index for unstructured snippets, case management API, RBAC, audit log

### 4. Data Flow
STIX validate → upsert entities → compute windows (e.g., 24h) → score candidate merges → write decision record → notify

### 5. Agent Interaction
Supervisor caps tool calls; correlation agent must attach **edge evidence** (source IDs, timestamps) before auto-actions

### 6. Scaling Challenges
Hot partitions on popular IOCs; backpressure on burst feeds; dedupe at ingest vs query time tradeoffs

### 7. Failure Handling
Poison message quarantine; partial graph writes compensated by saga; replay from immutable raw zone

### 8. Observability Considerations
Per-agent latency, fusion precision metrics, connector health, graph write rates, human override counts, $/1k IOCs processed
