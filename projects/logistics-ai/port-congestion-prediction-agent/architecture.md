### 1. System Overview
**Stream ingest** normalizes AIS messages. **Spatial index** assigns vessels to anchorages/berths. **Batch trainer** updates models weekly. **Online scorer** writes risk scores to cache.

### 2. Architecture Diagram (text-based)
```
AIS → spatial index → features → model scores
                         ↓
              port agent → alerts / TMS webhooks
```

### 3. Core Components
AIS deduper, geofence library, terminal connector adapters, model registry, alert deduplication, feedback UI for planners

### 4. Data Flow
Aggregate per port per hour → compute dwell distribution shifts → if anomaly vs baseline → open incident → agent summarizes drivers → notify subscribers

### 5. Agent Interaction
Agent cannot invent vessel counts; must cite SQL aggregates; news RAG optional overlay with lower weight than AIS features

### 6. Scaling Strategy
Global AIS volume requires Kafka partitioning by H3 cell; downsample low-risk areas; preaggregate per port hourly to cut query costs

### 7. Failure Modes
Receiver gaps create false drops in traffic; DST at ports; model stale after canal expansion—data quality flags, auto retrain triggers

### 8. Observability Considerations
Ingest lag, scoring freshness, alert precision in pilot, API spend, user acknowledgement latency
