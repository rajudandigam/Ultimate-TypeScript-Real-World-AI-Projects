### 1. System Overview

**Chat gateway** authenticates users and scopes **tenant + environment**. **Log Analysis Agent** executes **read-only** queries via adapters. **Session store** tracks investigation steps. **Publisher** posts summaries to Slack/tickets with deep links.

---

### 2. Architecture Diagram (text-based)

```
User / alert → BFF → Log Analysis Agent
        ↓
tools: query, trace, deploys, runbooks
        ↓
Structured answer → Slack / ticket
```

---

### 3. Core Components

- **UI / API Layer:** Web UI, Slack app, webhook receiver.
- **LLM layer:** Tool-using agent with iteration caps.
- **Agents (if any):** Single agent baseline.
- **Tools / Integrations:** Observability vendor APIs, git deploy tags, service catalog.
- **Memory / RAG:** Runbook index; optional incident embedding store.
- **Data sources:** Logs, traces, metrics, change events.

---

### 4. Data Flow

1. **Input:** Natural language question + optional `service`, `window`, `env`.
2. **Processing:** Agent plans queries; executes with row/step limits.
3. **Tool usage:** Pull correlated trace; fetch runbook chunks; assemble timeline JSON.
4. **Output:** Render markdown with citations to query ids and timestamps.

---

### 5. Agent Interaction (if applicable)

Single agent thread per incident channel; fork read-only for sub-questions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; per-tenant query concurrency pools.
- **Caching:** Short TTL cache for identical queries during storms.
- **Async processing:** Heavy investigations as background jobs with progress pings.

---

### 7. Failure Handling

- **Retries:** Idempotent queries where supported; avoid duplicate posts with id keys.
- **Fallbacks:** If RAG unavailable, still return query evidence without playbook text.
- **Validation:** Strip secrets via redaction pipeline before model calls.

---

### 8. Observability

- **Logging:** Tool success/fail counts, redaction stats, model version.
- **Tracing:** End-to-end latency per user question.
- **Metrics:** Queries per incident, human override rate, estimated data scanned.
