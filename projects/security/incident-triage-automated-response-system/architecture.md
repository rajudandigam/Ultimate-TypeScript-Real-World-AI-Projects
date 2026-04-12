### 1. System Overview
**Alert bus** fans into a **case object**. **Supervisor** sequences specialist agents and enforces **policy** (allowed tools, max blast). **Executor** runs **idempotent** actions with **compensation hooks** where possible.

### 2. Architecture Diagram (text-based)
```
Alert → triage agent → forensics agent → responder plan
                 ↓
           human approval → executor → audit trail
```

### 3. Core Components
Case API, connector registry, policy engine (OPA), secrets broker, execution sandbox, evidence object store, timeline UI

### 4. Data Flow
Normalize vendor JSON → attach MITRE tags → query tools in parallel → assemble timeline → score recommended actions → await approval token → execute → verify state

### 5. Agent Interaction
Agents communicate via structured messages only; supervisor strips free-text that could smuggle instructions

### 6. Scaling Challenges
Concurrent incidents per tenant; API rate limits; long-running queries need checkpointing

### 7. Failure Handling
Partial evidence → mark case “incomplete”; executor failure → auto-open rollback ticket; never lose raw vendor payloads

### 8. Observability Considerations
Trace each agent hop, tool latency histograms, approval latency, action outcomes, replayable incident bundles for postmortems
