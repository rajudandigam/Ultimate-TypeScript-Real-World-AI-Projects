### 1. System Overview
Event stream → **normalizer** → **feature joiner** → **rules + risk score** → **case workflow** → **reports** with immutable audit.

### 2. Architecture Diagram (text-based)
```
Payments stream → Kafka
        ↓
   Compliance workflow (Temporal)
        ↓
   Rules + models → alerts
        ↓
   Case store + analyst UI
        ↓
   Regulatory exports / SAR workflow (human-owned)
```

### 3. Core Components
Ingest adapters, rules engine, model scorer, case management UI, export adapters, secrets vault.

### 4. Data Flow
Normalize txn → compute features → evaluate ordered rules → open/update case → human disposition → archive with signatures.

### 5. Agent Interaction
Optional LLM for **draft narratives** from structured case JSON only—not alert scoring hot path by default.

### 6. Scaling Considerations
Partition by tenant; autoscale stream consumers; cold/warm storage for historical evidence.

### 7. Failure Handling
DLQ for poison events; idempotent case updates; circuit breakers on downstream APIs.

### 8. Observability
Alert volume, precision proxies, queue age, model version drift, export success rate.
