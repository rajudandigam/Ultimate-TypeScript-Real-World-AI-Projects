### 1. System Overview
Survey/feedback **connectors** → **normalize** → **aggregate mart** → **detector workflow** (thresholds/anomalies) → **digest generator** (optional LLM on cohort tables only) → **alerts** to HRBP inbox with **no raw PII** where forbidden.

### 2. Architecture Diagram (text-based)
```
Sources → ETL → aggregates → detection → alerts/dashboards
```

### 3. Core Components
Connector workers, PII vault rules engine, warehouse marts, BI embed, audit log, admin policy UI

### 4. Data Flow
Scheduled pull → validate sample sizes → compute themes → compare vs baseline → open action ticket if sustained breach

### 5. Agent Interaction
Optional LLM for human-readable cohort summaries; never raw comment streams to public channels

### 6. Scaling Considerations
Incremental loads; partition by geo; heavy NLP async

### 7. Failure Handling
Suppress alerts under privacy floor; quarantine new data sources until approved schema mapping

### 8. Observability
Ingest lag, suppression counts, alert volume, downstream action completion rate
