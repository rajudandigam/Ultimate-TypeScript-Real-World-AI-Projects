### 1. System Overview
**SCADA bridge** reads high-rate telemetry into a **time-series bus**. **Control sandbox** runs agents. **Production path** uses deterministic controllers; agents propose **setpoint deltas** consumed only after **RTAC** validation.

### 2. Architecture Diagram (text-based)
```
Telemetry → predictor → allocator (MPC) → trading
                    ↓
            supervisor → validated setpoints → SCADA
```

### 3. Core Components
State estimator, contingency library, market gateway, risk desk UI, digital twin for replay, immutable decision log

### 4. Data Flow
Ingest → align timestamps → forecast → optimize dispatch stack → run N-1 checks → if pass, stage commands → operator ack window → execute

### 5. Agent Interaction
Agents cannot bypass supervisor; trading agent budgets exposure from risk desk YAML; emergency agent can only tag priority loads, not rewire topology without rule engine

### 6. Scaling Strategy
Regional sharding; edge pre-aggregation; hot path in C++/Rust services with TS orchestration; backpressure on telemetry floods

### 7. Failure Modes
Bad PMU data; flapping battery commands; communication split—hold last safe state, fail operational per policy, alarm storm dedupe

### 8. Observability Considerations
Control loop latency, command acceptance rate, forecast error distribution, market connectivity health, incident replay bundles
