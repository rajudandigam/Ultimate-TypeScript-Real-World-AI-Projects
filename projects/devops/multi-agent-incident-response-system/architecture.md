### 1. System Overview

The system centers a **supervisor workflow** (Temporal) that owns incident state. Three LLM-backed agents produce **append-only evidence** and **proposed actions**. Only the supervisor may commit timeline events or enqueue mutations, after optional **human approval** tasks.

---

### 2. Architecture Diagram (text-based)

```
Alert / Chat / Manual start
        ↓
   Incident API → Supervisor workflow
        ↓
┌───────────────────────────────────────┐
│  Alert Analyzer Agent                 │
│   (dedupe, severity, initial queries) │
└───────────────┬───────────────────────┘
                ↓
┌───────────────────────────────────────┐
│  Root Cause Investigator Agent         │
│   (metrics/logs/traces tools)          │
└───────────────┬───────────────────────┘
                ↓
┌───────────────────────────────────────┐
│  Remediation Planner Agent             │
│   (change plan, rollback, comms draft)   │
└───────────────┬───────────────────────┘
                ↓
   Evidence store + Human approval gates
                ↓
   Ticketing / paging / (optional) automation executor
```

---

### 3. Core Components

- **UI / API Layer:** Incident console, approval inbox, webhook ingress with signature validation.
- **LLM layer:** Three role-specific system prompts and tool registries; shared tokenizer budget table.
- **Agents (if any):** Analyzer, investigator, planner—sequenced by default; limited parallelism only where safe.
- **Tools / Integrations:** Observability backends, deployment APIs, feature flags, chat/ticket systems.
- **Memory / RAG:** Historical incidents, known failure modes, service dependency docs.
- **Data sources:** Live telemetry, change events, org topology data.

---

### 4. Data Flow

1. **Input:** Normalize alert into `incident_id`; fetch baseline service metadata.
2. **Processing:** Analyzer proposes dedupe links and initial queries; supervisor executes approved queries.
3. **Tool usage:** Investigator issues templated queries; results stored as typed evidence blobs, not only prose.
4. **Output:** Planner emits structured remediation steps; supervisor opens human tasks for risky steps; on approval, executor runs with tight RBAC.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Analyzer compresses noise; investigator maximizes signal from observability tools; planner minimizes time-to-mitigate while calling out rollback paths. **Communication:** message-passing via supervisor state, not agent-to-agent chat. **Orchestration:** explicit state machine stages with deadlines and escalation if stuck.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition incidents by tenant; separate query workers from API; isolate heavy log pulls.
- **Caching:** Cache service dependency graphs; avoid caching volatile metric results beyond short TTL.
- **Async processing:** Long investigations run as child workflows with heartbeats; paging only on supervisor transitions.

---

### 7. Failure Handling

- **Retries:** Tool retries with jitter; supervisor detects repeated failures and requests narrower hypotheses.
- **Fallbacks:** If agents stall, fall back to static runbook steps and human takeover prompts.
- **Validation:** Schema validation on all proposed actions; deny-list dangerous commands; require dry-run output for infra changes.

---

### 8. Observability

- **Logging:** Structured incident audit log (who/what/when), separate from customer telemetry.
- **Tracing:** Trace each agent loop and each observability query with shared `incident_id`.
- **Metrics:** Agent step success rates, human approval latency, mean time to first grounded hypothesis.
