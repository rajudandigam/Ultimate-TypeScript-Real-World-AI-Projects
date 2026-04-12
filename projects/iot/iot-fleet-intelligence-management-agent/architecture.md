### 1. System Overview
**Ingest** normalizes device topics into a **metric model**. **Registry** tracks firmware cohorts. **Agent** composes queries and narrates findings with attached chart specs (Vega-Lite JSON).

### 2. Architecture Diagram (text-based)
```
Devices → MQTT/HTTP → stream processor → TSDB
                              ↓
                    fleet agent → tools → actions/answers
```

### 3. Core Components
Broker cluster, schema registry, TSDB, device shadow store, ticketing bridge, RBAC for cross-customer isolation

### 4. Data Flow
Question → map to metric keys → execute parameterized query → detect anomalies via rules/ML → attach cohort metadata → respond with visualization spec

### 5. Agent Interaction
Write tools require elevated scope + change ticket id; agent cannot push OTA without policy token

### 6. Scaling Challenges
High cardinality labels; cold vs hot storage tiering; multi-region replication lag

### 7. Failure Handling
Stale telemetry flags; partial query timeouts degrade to coarser rollups; never return raw PII from devices

### 8. Observability Considerations
Ingest lag per region, query latency, alert volume per firmware, agent tool errors, device offline rates
