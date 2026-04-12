### 1. System Overview
Planner UI triggers **Forecast Agent** → pulls **features** from warehouse tools → calls **forecast service** → receives **point + interval** → drafts narrative with **feature citations** → stores `forecast_run_id`.

### 2. Architecture Diagram (text-based)
```
Sales history → feature mart → forecast engine
        ↓
Forecast Agent → narrative + alerts → ERP/IBP export
```

### 3. Core Components
Warehouse, forecast microservice, agent BFF, policy engine for auto-publish, audit tables

### 4. Data Flow
Select SKU/location/horizon → fetch series + exogenous regressors → compute → compare vs prior version → notify if drift threshold

### 5. Agent Interaction
Single agent; numeric outputs from engine only

### 6. Scaling Considerations
Batch forecasts nightly; hot SKUs near-real-time; partition by DC

### 7. Failure Handling
Missing data → widen intervals; engine timeout → carry last good forecast with staleness flag

### 8. Observability
WAPE by category, pipeline runtime, override reasons, $ inventory impact proxies
