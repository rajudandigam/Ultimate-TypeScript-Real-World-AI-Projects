### 1. System Overview
Chat → **policy gate** → **agent** → **safety sidecar** (classifiers) → responses; **crisis** short-circuits to static resources + human protocols.

### 2. Architecture Diagram (text-based)
```
Client → BFF → Agent
        ↘ safety svc → risk score
Crisis path → resources UI (no delay)
```

### 3. Core Components
Session store, moderation, crisis playbook service, audit, optional human review queue.

### 4. Data Flow
Message → moderation → agent draft → post-check → deliver; high risk → block + resources.

### 5. Agent Interaction
Single agent; crisis path bypasses creative generation.

### 6. Scaling Considerations
Per-tenant isolation; rate limits; regional content packs.

### 7. Failure Handling
Model outage → templated supportive messages only; never empty crisis path.

### 8. Observability
Escalation counts, harmful attempt logs (careful PII), latency, counselor handoff rate.
