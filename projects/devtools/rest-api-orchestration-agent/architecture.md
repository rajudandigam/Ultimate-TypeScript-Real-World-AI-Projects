### 1. System Overview

**Connector registry** stores **base URLs**, **auth flows**, and **OpenAPI fragments**. **Orchestration Agent** executes a **run record** persisted by a **workflow service** (recommended). **HTTP executor** enforces **allowlists**, **timeouts**, and **response validation**. **Vault** injects secrets at execution time.

---

### 2. Architecture Diagram (text-based)

```
User goal → policy check → Orchestration Agent
        ↓
HTTP executor (allowlist + validate) → upstream APIs
        ↓
Run report + redacted audit
```

---

### 3. Core Components

- **UI / API Layer:** Run console, connector admin, secret rotation UI.
- **LLM layer:** Tool-using agent with capped steps.
- **Agents (if any):** Single agent; optional planner split later.
- **Tools / Integrations:** OAuth providers, webhooks, object storage for large payloads.
- **Memory / RAG:** Playbook retrieval; prior run transcripts (redacted).
- **Data sources:** OpenAPI specs, Postman collections (imported), env configs.

---

### 4. Data Flow

1. **Input:** Validate user authZ for connector + environment.
2. **Processing:** Agent plans steps; each HTTP call passes policy engine.
3. **Tool usage:** Validate response JSON against Zod; store checkpoint row.
4. **Output:** Final aggregate JSON to caller; async webhooks on completion.

---

### 5. Agent Interaction (if applicable)

Single agent per run; concurrent runs isolated by `run_id` and tenant.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless executor workers; per-tenant concurrency caps.
- **Caching:** Token caches with TTL near expiry minus skew.
- **Async processing:** Long runs as workflows with human pause/resume.

---

### 7. Failure Handling

- **Retries:** Classify errors; never blindly retry POST without idempotency key present.
- **Fallbacks:** Partial results with explicit `halt_reason`.
- **Validation:** Reject responses that fail schema—surface to agent for replanning within limits.

---

### 8. Observability

- **Logging:** Step outcomes, HTTP status classes, redaction stats.
- **Tracing:** Propagate W3C trace context to upstreams where supported.
- **Metrics:** Success rate by connector, p95 step latency, policy block counts.
