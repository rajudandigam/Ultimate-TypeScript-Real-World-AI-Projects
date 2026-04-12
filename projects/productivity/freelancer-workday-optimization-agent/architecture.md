### 1. System Overview
**Connector layer** syncs tasks and time entries. **Planner service** stores proposed day versions. **Agent** is stateless per request with snapshot IDs to avoid huge prompts.

### 2. Architecture Diagram (text-based)
```
Boards/calendar → snapshot builder → freelancer agent → draft plan
                          ↓
                   user confirm → calendar write + audit
```

### 3. Core Components
OAuth token vault, webhook sync, rate limiter per vendor API, diff viewer vs yesterday’s plan, encrypted notes field

### 4. Data Flow
Pull deltas → compute slack per deadline → allocate deep work → insert breaks → detect meetings → compress plan → return JSON + narrative

### 5. Agent Interaction
Write tools require user session elevation; agent receives redacted client names if user toggles privacy mode

### 6. Scaling Considerations
Heavy boards need incremental sync; shard by user; cache vendor responses; batch morning jobs across timezones

### 7. Failure Scenarios
API partial outage → plan with “unknown” sections; double-book auto-detect → warn; hallucinated task IDs → schema validation rejects

### 8. Observability Considerations
Connector error rates, plan acceptance %, slip prediction precision (retro), LLM cost per planning session
