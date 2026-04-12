### 1. System Overview
**Connector plane** lands raw messages/docs in a lakehouse. **Resolver** assigns stable entity IDs. **Graph writer** applies idempotent upserts with provenance payloads.

### 2. Architecture Diagram (text-based)
```
Slack/Docs/Mail → ETL → resolver → graph store
                         ↓
              memory agent → API / copilot clients
```

### 3. Core Components
ACL sync from IdP groups, PII classifier on ingress, graph versioning, incremental index for free-text on nodes, admin “delete my data” jobs

### 4. Data Flow
Ingest batch → extract entities/relations (rules + ML) → score confidence → auto-commit high, queue medium/low → nightly reconcile duplicates → expose read API with authz filters

### 5. Agent Interaction
Every traversal injects `principal` context; subgraph queries capped by hop count and time window

### 6. Scaling Strategy
Partition graph by tenant; async heavy extractions; cache hot neighborhoods; rate limit expensive traversals per user

### 7. Failure Modes
Connector throttling; partial backfills creating dangling edges—compensating transactions, repair sweeps

### 8. Observability Considerations
Ingest lag, resolver disagreement rate, query p95, cache hit ratio for neighborhoods, connector error taxonomy
