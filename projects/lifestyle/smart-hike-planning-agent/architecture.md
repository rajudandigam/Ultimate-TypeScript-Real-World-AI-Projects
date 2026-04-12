### 1. System Overview
**Profile store** holds fitness band, gear, and risk tolerance. **Agent runtime** executes a bounded tool plan per request. **Post-processor** enforces max distance/gain caps even if the model misbehaves.

### 2. Architecture Diagram (text-based)
```
Client → hike agent → weather / trails / elevation tools
                ↓
         validated plan JSON → UI + optional calendar
```

### 3. Core Components
Trail catalog ETL, weather cache, policy engine (hard stops), notification service, audit log for recommendations

### 4. Data Flow
Geocode user → radius search trails → filter by gain/length → merge forecast → compute risk score → emit plan variants (easy/medium)

### 5. Agent Interaction
Single agent thread; parallel tool calls for independent fetches; final answer must reference trail IDs from tool JSON

### 6. Scaling Considerations
Popular regions need CDN-cached trail snippets; batch precompute “good windows” for top trails to cut live API calls

### 7. Failure Scenarios
Partial tool failure → omit dimension with explicit “unknown”; conflicting trail names → disambiguation UI; model proposes closed trail → post-filter rejects

### 8. Observability Considerations
Tool latency, cache hit ratio, override reasons, incident reports correlated to plans (privacy-safe aggregates)
