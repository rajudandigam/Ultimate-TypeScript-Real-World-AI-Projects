### 1. System Overview
**Agent** outputs **UI-DSL JSON**. **Validator** rejects unknown nodes. **Renderer** maps nodes to React components with typed props. **Telemetry** captures render success and interaction paths.

### 2. Architecture Diagram (text-based)
```
Prompt → UI agent → JSON tree → Zod validate
                     ↓
            registry renderer → streamed UI
```

### 3. Core Components
Component registry service, token/theme provider, tool bridge (data fetch), error boundary per subtree, snapshot tests in CI

### 4. Data Flow
User intent → pull minimal context (not full DOM) → stream tokens → assemble tree → hydrate interactive callbacks → log outcomes

### 5. Agent Interaction
Agent cannot emit raw HTML strings; only enumerated `type` keys with bounded props

### 6. Scaling Challenges
Large tables need virtualization hints; many parallel streams per session need backpressure

### 7. Failure Handling
Validation error → fallback “summary card”; partial stream timeout → show skeleton + retry

### 8. Observability Considerations
Invalid schema rate, render latency, client error rates, most-used components, token cost per screen
