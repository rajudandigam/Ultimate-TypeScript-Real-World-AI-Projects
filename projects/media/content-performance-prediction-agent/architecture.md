### 1. System Overview
**CMS hook** sends draft features. **Prediction service** returns **scores + intervals**. **Performance Agent** fetches **nearest neighbor** past videos via tools and writes **actionable suggestions** with citations to metrics rows.

### 2. Architecture Diagram (text-based)
```
Draft → features → model service
        ↓
Performance Agent → similar videos tool → suggestions UI
```

### 3. Core Components
Feature pipeline, model registry, vector index of past content metadata, agent BFF, experiment tracker

### 4. Data Flow
Assemble feature vector → inference → attach SHAP-like aggregates (server-computed) → optional LLM narrative → store prediction id for later outcome join

### 5. Agent Interaction
Single agent; predictions immutable except via new model version

### 6. Scaling Considerations
Batch offline scoring for calendars; online low-latency path for title variants only

### 7. Failure Handling
Cold-start new channel → widen intervals + request more manual tags; model version rollback switch

### 8. Observability
Prediction vs actuals drift monitors, API latency, retrain cadence triggers, user override rate
