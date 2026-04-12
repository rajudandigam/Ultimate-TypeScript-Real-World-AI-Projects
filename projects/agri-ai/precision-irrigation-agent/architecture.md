### 1. System Overview
**Field gateway** ingests probe rows. **Weather service** provides hourly grids. **Policy service** encodes legal and farm rules. **Agent** emits **controller commands** through an adapter abstraction.

### 2. Architecture Diagram (text-based)
```
Sensors + weather → feature join → irrigation agent
                          ↓
              rules → valve commands → audit log
```

### 3. Core Components
Device registry, calibration UI, simulation sandbox (digital field twin lite), alerting, controller plugins (Vendor A/B)

### 4. Data Flow
Ingest → gap-fill short outages → forecast ET → optimize per zone → validate hard caps → publish schedule version → monitor actual flow meters for drift

### 5. Agent Interaction
Agent cannot exceed district daily cap tool response; conflicts return structured “infeasible” with relax options

### 6. Scaling Strategy
Hundreds of zones: partition by farm; precompute ET grids CDN-cached; edge buffer 24h commands if uplink drops

### 7. Failure Modes
Stuck-open valve detection via flow anomaly; bad GPS geofence assignment; DST boundary bugs—timezone-aware tests, hardware interlocks independent of AI

### 8. Observability Considerations
Water volume delivered vs planned, override reasons, sensor offline %, model disagreement rate, pump runtime stress
