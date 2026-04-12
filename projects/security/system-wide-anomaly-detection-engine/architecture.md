### 1. System Overview
**Stream ingest** writes normalized events to a **lakehouse** and **online feature store**. **Batch jobs** refresh baselines; **stream workers** score live. **Case workflow** owns escalation and closure metadata.

### 2. Architecture Diagram (text-based)
```
Logs/metrics → stream extract → feature store
        ↓
   scorer → ranker → dedupe → incident workflow
```

### 3. Core Components
Collector agents, schema registry, online store (Redis/Dynamo), offline trainer, scoring service, incident API, label UI

### 4. Data Flow
Event → enrich (geo, asset) → join rolling windows → emit anomaly record with top features → webhook/pager

### 5. Agent Interaction
Optional LLM summarizer consumes **only** JSON anomaly payloads (no raw log dump) to reduce leakage risk

### 6. Scaling Challenges
Skewed keys (popular services), late-arriving data, cardinality explosions on high-cardinality labels

### 7. Failure Handling
Backfill mode after outages; score degradation flags; circuit breakers when stores lag

### 8. Observability Considerations
Ingest lag, scoring p99, alert volume per rule version, analyst thumbs up/down, data quality SLOs on parsers
