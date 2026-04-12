### 1. System Overview
Real-time ADT → **state store** → **supervisor** dispatches **bed/staff/OR agents** → **solver** → proposals → **human approve** → write-backs.

### 2. Architecture Diagram (text-based)
```
ADT/HL7 → ingest
        ↓
   Supervisor + agents
        ↓
   Solver validation
        ↓
   Command center → EHR/bed APIs
```

### 3. Core Components
Integration bus, state service, agents, solver, UI, audit, RBAC.

### 4. Data Flow
Event → update graph → agents score options → solver feasibility → human ack → apply.

### 5. Agent Interaction
Supervisor merges conflicts; agents have scoped tools (read-heavy).

### 6. Scaling Considerations
Hospital-sharded; high availability; replay from offset on outages.

### 7. Failure Handling
Reject infeasible moves; rollback on failed API apply; never double-book OR.

### 8. Observability
Boarding minutes, proposal acceptance, API failures, solver runtime.
