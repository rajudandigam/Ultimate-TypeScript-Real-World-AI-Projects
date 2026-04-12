### 1. System Overview

Requests hit a **policy API** that first runs a **deterministic rules evaluation** service. The **policy agent** consumes engine JSON and optional **retrieved clauses** to produce user-facing explanations and **routing hints**. **Workflows** manage approval chains, escalations, and notifications. All decisions append to an **immutable audit log**.

---

### 2. Architecture Diagram (text-based)

```
Client / TMC webhook
        ↓
   Policy API
        ↓
   Rules engine (OPA/custom) → verdict JSON
        ↓
   Policy Agent (explain + route tools)
        ↓
   Approval workflow
        ↓
   Booking / expense systems
```

---

### 3. Core Components

- **UI / API Layer:** Request forms, approver inbox, admin policy editor with versioning.
- **LLM layer:** Explanation and exception drafting agent (read-mostly tools).
- **Agents (if any):** Single policy agent.
- **Tools / Integrations:** HRIS, TMC, SSO, ticketing for policy questions.
- **Memory / RAG:** Versioned policy index; exception precedents (governed).
- **Data sources:** Canonical policy documents, rate tables, org hierarchy.

---

### 4. Data Flow

1. **Input:** Structured trip parameters + traveler identity claims.
2. **Processing:** Engine evaluates; if violations, agent explains each with `rule_id`.
3. **Tool usage:** Fetch policy text spans; create approval tasks with prefilled context.
4. **Output:** Persist verdict; if approved override, store approver identity and rationale code.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional **batch summarizer** job for weekly policy violation digests (no booking authority).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; scale workflow workers independently; shard by tenant.
- **Caching:** Per-tenant policy embedding/index snapshots invalidated on publish.
- **Async processing:** Bulk re-evaluation when corporate deals change.

---

### 7. Failure Handling

- **Retries:** Transient HR/TMC failures with backoff; fail closed or escalate per tenant config.
- **Fallbacks:** If LLM unavailable, return engine codes with templated human text.
- **Validation:** Reject agent-proposed actions that contradict engine verdict without override record.

---

### 8. Observability

- **Logging:** Verdict codes, policy version, approval outcomes, model latency.
- **Tracing:** Trace `request_id` through engine, agent, and workflows.
- **Metrics:** False allow/escalation rates, mean approval time, policy cache hit rate, override counts by manager level.
