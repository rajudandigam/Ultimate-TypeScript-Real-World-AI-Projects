### 1. System Overview
**Dispatch BFF** collects stops. **Constraint builder** (agent-assisted) posts job to **VRP worker**. **Results** returned with geometry + ETAs. **Agent** narrates changes vs prior plan. **Approval** gate writes final routes to driver system.

### 2. Architecture Diagram (text-based)
```
Stops/constraints → VRP solver → routes
        ↓
Agent explain + exceptions → dispatcher approve → telematics
```

### 3. Core Components
Solver pool, geocoder, traffic adapter, agent service, dispatcher UI, mobile sync API

### 4. Data Flow
Import orders → geocode validate → build matrix → solve → simulate HOS → publish or request edits

### 5. Agent Interaction
Single agent for explain/replan suggestions; solver authoritative for distances/times

### 6. Scaling Considerations
Partition by depot; warm start routes; async solves for large fleets

### 7. Failure Handling
Infeasible → relax soft windows with explicit list; partial failures mid-route → local repair heuristic

### 8. Observability
Solve time distribution, miles per stop, SLA violations, replan counts per day
