### 1. System Overview

Log plane streams into UI; CopilotKit selection drives agent tools against repo + CI systems.

---

### 2. Architecture Diagram (text-based)

```
Log UI
 -> ingest WS
 -> Debug Copilot
 -> GitHub/CI/OTel
```

---

### 3. Core Components

- UI: virtualized logs + CopilotKit
- LLM: debugging agent
- Tools: repo + CI

---

### 4. Data Flow

1. Click log line
2. Agent gathers frames + files
3. Streams explanation + suggested patch PR

---

### 5. Agent Interaction (AG-UI)

Agent session bound to trace_id + repo revision.

---

### 6. Scaling Considerations

- Horizontally partition ingest
- Backpressure on bursty logs

---

### 7. Failure Handling

- Partial traces → explicit uncertainty
- Vendor outage → cached symbols only

---

### 8. Observability

- Trace selection + model spans
- Scrubbing metrics

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Live Log Debugging Copilot UI**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Selection carries byte offsets + parsed stack keys
- CopilotKit keeps thread tied to log filter state

### Suggested Data and Infra Layer
- Postgres (RLS) for entities, saved lenses, audit of AI-proposed UI mutations.
- Redis for rate limits, presence, ephemeral collaboration.
- Object storage for exports and large attachments.
- Queues/workers for heavy async recompute off the hot UI path.

### Suggested Runtime and Deployment
- Vercel for Next.js when web-first; Fly/Railway/Docker for WebSocket workers and long agent runs.

### Testing and Evaluation Strategy
- Vitest for reducers and schema validation; Playwright for AG-UI golden paths; eval sets for grounded numeric or log claims.

### Security and Permissions Layer
- RBAC mirrored in UI and tools; audit AI-suggested mutations; rate limits; PII minimization in prompts.
- Never exfiltrate secrets from logs to the model without scrubbers.
