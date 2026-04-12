### 1. System Overview

Alerts enter a **correlation workflow** that builds an **incident graph** (entities, edges, evidence pointers). A **supervisor** dispatches tasks to **Intrusion Detector**, **Response**, and **Mitigation Planner** agents with **scoped toolsets**. Approved actions execute via an **action executor** service with **receipts** and **compensation hooks**.

---

### 2. Architecture Diagram (text-based)

```
SIEM / EDR alerts
        ↓
   Correlation workflow → incident graph (Postgres)
        ↓
   Supervisor (policy + approvals)
     ↙      ↓       ↘
Detector   Response   Planner
 (read+)   (execute*)  (sequence)
        ↓
   Approval queue (human)
        ↓
   Executor → cloud/EDR APIs
        ↓
   Audit + updated graph
```

*Execute tools only after approval tokens in production designs.

---

### 3. Core Components

- **UI / API Layer:** Incident console, approvals, rollback wizard.
- **LLM layer:** Three specialist agents + supervisor orchestration.
- **Agents (if any):** Intrusion detector, response agent, mitigation planner.
- **Tools / Integrations:** SIEM query, EDR actions, ticketing, firewall management.
- **Memory / RAG:** Runbooks and historical incidents (governed retrieval).
- **Data sources:** Security telemetry, CMDB, IAM directory metadata.

---

### 4. Data Flow

1. **Input:** Normalize alerts into entities; dedupe into incident candidates.
2. **Processing:** Detector proposes hypotheses with evidence IDs; planner proposes remediation DAG.
3. **Tool usage:** Read tools widely; write tools only through executor after approval.
4. **Output:** Update incident state; notify stakeholders; schedule verification checks.

---

### 5. Agent Interaction (if applicable)

**Supervisor** resolves conflicts (e.g., planner vs responder timing), merges outputs into a single incident timeline, and enforces **stop conditions** (budgets, irreversible actions).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition incidents by tenant; scale executor workers independently from LLM workers.
- **Caching:** Read-through caches for CMDB lookups with short TTL.
- **Async processing:** Heavy log searches as background activities with partial results streaming to UI.

---

### 7. Failure Handling

- **Retries:** Tool retries with jitter; saga compensation on partial failures.
- **Fallbacks:** Manual mode if automation disabled for tenant during maintenance.
- **Validation:** Pre-flight checks (maintenance flags, ownership tags) before containment.

---

### 8. Observability

- **Logging:** Structured action logs with correlation IDs; no secrets in messages.
- **Tracing:** Trace per `incident_id` across agents and executor.
- **Metrics:** MTTR/MTTC proxies, automation success rate, human override reasons, false positive containment tracking.
