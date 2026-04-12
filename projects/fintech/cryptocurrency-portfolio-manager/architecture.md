### 1. System Overview
**Indexers** pull balances; **pricing service** attaches marks; **rebalance engine** proposes trades; **agent** explains proposals.

### 2. Architecture Diagram (text-based)
```
Wallets/CEX (read) → aggregator → Postgres
        ↓
   Portfolio Agent → rebalance JSON
        ↓
   User approval → signer service (isolated)
```

### 3. Core Components
Connectors, price oracles, portfolio DB, agent BFF, signer/HSM integration optional.

### 4. Data Flow
Poll/sync → normalize positions → compute weights vs target → propose trades → user confirms → signer executes.

### 5. Agent Interaction
Single agent; signer is not LLM.

### 6. Scaling Considerations
Per-user sync queues; cache prices; backoff on RPC.

### 7. Failure Handling
Partial sync states; never show stale totals without timestamp.

### 8. Observability
Connector errors, sync lag, proposal acceptance rate, security alerts.
