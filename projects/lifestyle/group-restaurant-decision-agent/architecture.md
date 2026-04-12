### 1. System Overview
**Session service** stores participants and votes. **Orchestrator** runs the multi-agent graph once per “round” until shortlist or max steps. **Tool gateway** isolates API keys per tenant.

### 2. Architecture Diagram (text-based)
```
Clients → BFF → facilitator → preference / venue / scorer agents
                        ↓
                 ranked shortlist → push + audit log
```

### 3. Core Components
Session DB, invite tokens, maps adapter, scoring engine (deterministic core + LLM explain layer), notification worker

### 4. Data Flow
Collect votes → normalize constraints → query venues (paginated) → score → prune dominated options → return top-k with map links

### 5. Agent Interaction
Agents exchange **JSON messages** only; facilitator validates schema before next hop; no agent may widen budget without user ack

### 6. Scaling Considerations
Burst traffic Friday evenings; cache popular polygons; shard sessions by city; backoff on Places quotas

### 7. Failure Scenarios
API outage → cached fallback list + honesty banner; tie scores → offer random fair shuffle among ties; timeout → freeze session state for resume

### 8. Observability Considerations
Steps per session, tool error rate, pick conversion rate, p95 latency to shortlist, cost per successful decision
