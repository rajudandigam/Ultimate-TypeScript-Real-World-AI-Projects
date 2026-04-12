### 1. System Overview
**Schedule store** holds active plans per asset. **Telemetry** tracks actual kW and SOC estimates. **Agent** re-solves on trigger events (price change, cloud front).

### 2. Architecture Diagram (text-based)
```
Rates + solar + EV state → EV agent → solver → OCPP commands
                         ↓
                   telemetry feedback loop
```

### 3. Core Components
OCPP gateway, rate plan registry, solar forecast cache, fleet transformer monitor, alerting on constraint violations

### 4. Data Flow
Pull state → build horizon model → solve → translate to charger setpoints → stream commands → log deviations → nightly reconcile billing estimate

### 5. Agent Interaction
Solver is authoritative; agent cannot inject power targets without passing feasibility check

### 6. Scaling Strategy
Many vehicles: partition by site; batch solves; prioritize near-departure vehicles; backoff on charger API rate limits

### 7. Failure Modes
Stale SOC from car API; clock skew; charger stuck on—watchdog halts ramp, notify ops

### 8. Observability Considerations
Command success rate, solver time p99, $/session, carbon proxy error vs utility-provided factors, user override frequency
