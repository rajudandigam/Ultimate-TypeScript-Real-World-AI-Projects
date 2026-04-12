### 1. System Overview
**Edge ingest** normalizes tags to a canonical schema. **Feature pipeline** computes condition indicators. **Multi-agent orchestrator** runs bounded negotiation rounds until a **work order draft** or **monitor-only** outcome.

### 2. Architecture Diagram (text-based)
```
IoT → stream bus → feature store → diagnostics / RUL agents
                         ↓
        scheduler ↔ parts agents → supervisor → CMMS ERP
```

### 3. Core Components
MQTT/Kafka cluster, identity for assets, model registry, rules engine (SIL-rated interlocks), CMMS connector, spare parts cache, human HITL UI

### 4. Data Flow
Telemetry batch → anomaly score → if threshold → spawn agent session → attach evidence bundle → propose WO with confidence → await approval token → post to ERP → track execution → label for retrain

### 5. Agent Interaction
Structured message bus; supervisor rejects actions lacking spare confirmation or conflicting with locked production plan

### 6. Scaling Strategy
Shard by plant line; downsample high-rate vibration at edge; hot/cold storage tiering; GPU pools only for heavy inference jobs

### 7. Failure Modes
Clock skew across PLCs; duplicate sensor naming; model version incompatible with firmware—schema validation, canary models, rollback switches

### 8. Observability Considerations
Per-asset inference lag, queue backlog, WO API error taxonomy, human override reasons, $/asset/month compute, safety trip correlation
