### 1. System Overview
User asks → **agent** → parallel **market data + news tools** → **brief composer** (schema) → UI with `data_asof` footer.

### 2. Architecture Diagram (text-based)
```
Client → Intelligence BFF → FinGPT Agent → vendors (quotes/news)
                      ↘ indicator worker (deterministic)
```

### 3. Core Components
Auth, vendor router, cache, indicator service, agent runtime, rate limiter, audit.

### 4. Data Flow
Resolve symbols → fetch normalized bars → compute indicators → fetch headlines → assemble JSON brief → render.

### 5. Agent Interaction
Single agent; optional offline **macro** summarizer batch job.

### 6. Scaling Considerations
Per-symbol cache TTLs; regional endpoints; burst QPS controls.

### 7. Failure Handling
Partial briefs with explicit missing sections; circuit breakers per vendor.

### 8. Observability
Vendor error taxonomy, cache hit rate, token usage, hallucination flags from eval harness.
