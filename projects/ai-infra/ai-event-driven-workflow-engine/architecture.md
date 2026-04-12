### 1. System Overview

Events land on an **ingress bus** with dedupe keys. A **router** starts **workflow executions** in Temporal/Inngest. Each workflow composes **activities**: validate payload, call LLM with schema, call external APIs, wait for human signals, compensate on failure.

---

### 2. Architecture Diagram (text-based)

```
Event source → Ingress (verify + dedupe)
        ↓
   Router (event_type → workflow version)
        ↓
   Workflow engine
   ├─ Activities: LLM classify / summarize
   ├─ Activities: SaaS writes (idempotent)
   └─ Signals: human approvals
        ↓
   Completion event / DLQ
```

---

### 3. Core Components

- **UI / API Layer:** Subscription admin, run explorer, DLQ triage.
- **LLM layer:** LLM activities isolated with timeouts and schema validation.
- **Agents (if any):** Optional bounded agent inside a sandbox activity—not the workflow scheduler itself.
- **Tools / Integrations:** CRM, ticketing, email, internal microservices.
- **Memory / RAG:** Retrieval activities with ACL; workflow memo for small state.
- **Data sources:** Webhooks, queues, object notifications, metric alerts.

---

### 4. Data Flow

1. **Input:** Receive event; verify signature; compute dedupe key; enqueue start.
2. **Processing:** Workflow executes activities in order with checkpoints; LLM outputs validated before writes.
3. **Tool usage:** Side-effect activities use per-tenant credentials from vault with scoped tokens.
4. **Output:** Emit completion or compensation chain; archive run history per retention policy.

---

### 5. Agent Interaction (if applicable)

Not multi-agent by default. If an agent runs, it is **encapsulated** as an activity with its own audit boundary.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition workflows by tenant; autoscale workers; separate hot routers from cold archival.
- **Caching:** Cache routing tables; avoid caching nondeterministic LLM outputs as routing inputs.
- **Async processing:** Everything async by design; prioritize queues for SLA tiers.

---

### 7. Failure Handling

- **Retries:** Activity retries with policies; workflow-level continue-as-new for long-running cases.
- **Fallbacks:** DLQ with replay tooling; manual override signals.
- **Validation:** Schema validation on all external writes; quarantine poison payloads.

---

### 8. Observability

- **Logging:** `workflow_id`, `run_id`, activity outcomes; redact sensitive fields.
- **Tracing:** Link spans across activities and LLM calls with shared `correlation_id`.
- **Metrics:** Start rate, success rate, activity latency heatmaps, DLQ rate, LLM invalid JSON rate.
