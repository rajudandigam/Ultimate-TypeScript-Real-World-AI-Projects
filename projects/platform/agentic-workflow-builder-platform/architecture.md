### 1. System Overview
**Editor** emits **graph IR**. **Compiler** validates types, secrets, and egress. **Runtime** schedules node executions with idempotency keys per branch.

### 2. Architecture Diagram (text-based)
```
Canvas → IR → compiler → queue → executor pool
                         ↓
                   tool gateway → telemetry
```

### 3. Core Components
AuthZ service, graph store with semver, execution history, tool registry, sandbox workers (WASM/VM), webhook ingress

### 4. Data Flow
Trigger (schedule/event) → hydrate context → walk graph → persist node outputs → aggregate final payload → callbacks

### 5. Agent Interaction
Planner proposes subgraphs; Evaluator checks outputs vs rubric; human can edit plan before commit

### 6. Scaling Challenges
Fan-out fan-in patterns; long LLM chains need checkpointing; noisy neighbors in shared worker pools

### 7. Failure Handling
Per-node retry policies; compensating transactions for side-effect nodes; poison subgraph disablement

### 8. Observability Considerations
Per-node traces, token/cost attribution, replay hashes, diff view between graph versions, failure taxonomy
