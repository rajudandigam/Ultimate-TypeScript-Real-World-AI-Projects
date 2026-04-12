### 1. System Overview
Market data → **feature pipeline** → **policy service** (RL model artifact) → **risk** → **execution** → **OMS/ledger**; **experiment tracker** records versions.

### 2. Architecture Diagram (text-based)
```
Ticks → features → Policy (RL)
        ↓
   Risk engine (limits, kill)
        ↓
   Broker adapter (paper/live)
        ↓
   Telemetry + PnL accounting
```

### 3. Core Components
Sim cluster, trainer jobs, model registry, policy server, risk service, execution gateway, monitoring.

### 4. Data Flow
Subscribe ticks → state update → action → risk approve/reject → order idempotency → fill events → reconcile.

### 5. Agent Interaction
Optional **LLM “research notes”** offline; trading path remains deterministic + RL policy outputs.

### 6. Scaling Considerations
Hot/warm paths; autoscale policy replicas; isolate training from trading network.

### 7. Failure Handling
Kill switch on anomaly; cancel open orders; revert to baseline policy version.

### 8. Observability
Latency histograms, fill quality, drift vs sim, incident paging, audit of parameter changes.
