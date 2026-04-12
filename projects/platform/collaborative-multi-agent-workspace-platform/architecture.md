### 1. System Overview
**Workspace** stores artifacts (docs, tables, canvases). **Mediator** translates agent actions into **CRDT ops** or rejects them. **Bus** broadcasts presence and agent intents.

### 2. Architecture Diagram (text-based)
```
Clients ↔ CRDT sync ↔ mediator ↔ agents (tools)
                 ↓
            audit log + replay snapshots
```

### 3. Core Components
AuthN/Z, document service, agent runtime pods, tool gateway, search index, export workers, admin policy UI

### 4. Data Flow
Human edit → CRDT update → agents observe diff → propose ops → mediator validates schema/policy → apply or comment-only

### 5. Agent Interaction
Agents never share raw memory; structured proposals only; critic may veto with rationale referencing doc spans

### 6. Scaling Challenges
Large documents; fan-out of updates; many agents subscribing to same shard

### 7. Failure Handling
Mediator crash → deterministic replay from CRDT log; agent crash → rehydrate from checkpointed plan

### 8. Observability Considerations
Op throughput, reject reasons, agent contention metrics, end-user latency, storage growth rate per workspace
