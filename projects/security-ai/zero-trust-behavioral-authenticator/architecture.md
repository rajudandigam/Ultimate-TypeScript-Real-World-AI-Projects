### 1. System Overview
**Event bus** ingests auth logs, endpoint access, device posture. **Feature store** serves low-latency aggregates. **Scoring service** returns decisions in milliseconds. **Agent** is async for analyst assist only.

### 2. Architecture Diagram (text-based)
```
Identity events → features → risk models → policy actions
                              ↓
                    analyst agent (async) → tickets
```

### 3. Core Components
Model registry with approvals, drift monitors, allowlist for break-glass, SIEM exporters, privacy ledger for consent states

### 4. Data Flow
Event → enrich with user/device context → compute windowed features → model ensemble → decision → emit to IdP step-up API or app middleware header

### 5. Agent Interaction
Agent never changes live policies; proposes YAML diffs in staging PRs only

### 6. Scaling Strategy
Shard Kafka by tenant; preaggregate heavy joins offline; edge rate limiting; cold path training in separate VPC

### 7. Failure Modes
Model outage → fail open with stepped logging vs fail closed per tier; poisoned features from compromised log pipeline—signed telemetry sources

### 8. Observability Considerations
Score distribution shifts, action rates by app, appeal success, calibration drift alerts, P99 scoring latency
