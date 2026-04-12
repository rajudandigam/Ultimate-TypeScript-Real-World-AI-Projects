### 1. System Overview
Mobile/web → **BFF** → **Postgres ledger** → **Budget Agent** (tools) → responses; notification queue optional.

### 2. Architecture Diagram (text-based)
```
Client → BFF → Agent → ledger/categorization tools → JSON UI payloads
```

### 3. Core Components
Auth, ledger API, categorization (rules + optional LLM), agent runtime, analytics rollup jobs.

### 4. Data Flow
Ingest txns → normalize → categorize → agent answers from aggregates → user confirms corrections → feedback loop.

### 5. Agent Interaction
Single conversational agent.

### 6. Scaling Considerations
Per-user sharding; cache monthly rollups; async bank webhooks.

### 7. Failure Handling
Idempotent webhooks; duplicate detection; safe defaults on sync failure.

### 8. Observability
Sync health, category override rate, agent latency, cost per user.
