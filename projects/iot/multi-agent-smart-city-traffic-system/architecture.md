### 1. System Overview

Telemetry lands in a **stream processing** layer producing **corridor state snapshots**. A **supervisor** coordinates **Estimator**, **Optimizer**, and **Incident** agents. Proposed timing plans pass through **constraint validation** and optional **simulation check**, then enter an **approval queue** for operators before **controller gateway** issues signed commands.

---

### 2. Architecture Diagram (text-based)

```
Sensors / controllers (edge)
        ↓
   Stream ingest (Kafka/MQTT)
        ↓
   Fusion + snapshot builder
        ↓
   Supervisor
   ↙   ↓   ↘
Estim  Optim  Incident
        ↓
   Validator + (optional) sim
        ↓
   Operator approval (human)
        ↓
   Controller gateway (signed)
```

---

### 3. Core Components

- **UI / API Layer:** Operator console, audit viewer, policy editor.
- **LLM layer:** Multi-agent reasoning over structured snapshots.
- **Agents (if any):** Estimator, optimizer, incident coordinator (+ supervisor).
- **Tools / Integrations:** Signal controllers, navigation feeds, construction DBs.
- **Memory / RAG:** Playbooks and incident retrospectives (governed).
- **Data sources:** Loops, detectors, buses, weather, events.

---

### 4. Data Flow

1. **Input:** Ingest high-frequency events; aggregate to corridor KPIs on a tick schedule.
2. **Processing:** Estimator explains anomalies; incident agent proposes detours; optimizer proposes timing deltas.
3. **Tool usage:** Query twin predictions, queue lengths, pedestrian countdown constraints.
4. **Output:** Versioned plan artifact; notify operators; deploy after approval with rollback pointer.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves conflicts (e.g., emergency preemption freezes optimization), merges partial plans, and enforces **non-negotiable** safety constraints from policy service.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard by district; edge preprocessing reduces cloud load.
- **Caching:** Hot corridor snapshots; precomputed baseline plans.
- **Async processing:** Heavy simulation offline; online path uses lightweight checks.

---

### 7. Failure Handling

- **Retries:** Controller retries with bounded attempts; never oscillate phases rapidly.
- **Fallbacks:** Revert to coordinated fixed plan library if agents unhealthy.
- **Validation:** Hard reject plans violating minimum greens / walk times.

---

### 8. Observability

- **Logging:** Plan versions, approvals, overrides, controller ACK/NACK.
- **Tracing:** Trace `corridor_id` through ingest → agents → gateway.
- **Metrics:** Travel time indices, queue spillback events, sensor staleness, safety constraint violations (should be zero).
