### 1. System Overview
**Session broker** allocates VMs. **Driver service** exposes typed RPC (click, read tree). **Agent** plans steps with bounded horizon. **Supervisor** enforces policy and kill switch.

### 2. Architecture Diagram (text-based)
```
Policy → session VM → driver RPC ↔ agent loop
                 ↓
           artifacts → audit → customer API
```

### 3. Core Components
Fleet scheduler, recording store, secret injector, policy engine, human remote control UI, metrics pipeline

### 4. Data Flow
Task JSON → compile allowed targets → open app → loop observe/act until terminal condition or budget exceeded → return structured result

### 5. Agent Interaction
Vision tools optional; primary path prefers accessibility IDs; agent cannot disable logging

### 6. Scaling Challenges
GPU/CPU cost per session; concurrent interactive sessions; flaky remote desktops

### 7. Failure Handling
Stuck detection (no state change N steps) → escalate to human; app crash → restart recipe; network loss → pause with resume token

### 8. Observability Considerations
Per-step latency, failure class histograms, human override reasons, resource usage per tenant, replay bundles for audits
