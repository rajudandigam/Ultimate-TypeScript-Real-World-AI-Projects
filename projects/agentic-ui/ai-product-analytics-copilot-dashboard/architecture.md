### 1. System Overview

Next.js dashboard hosts CopilotKit; BFF enforces SQL guardrails; analyst agent calls warehouse through allowlisted templates.

---

### 2. Architecture Diagram (text-based)

```
Browser (Next+CopilotKit)
 -> BFF (Hono)
 -> Analytics Agent
 -> Warehouse + metric catalog
```

---

### 3. Core Components

- UI: charts + CopilotKit provider
- LLM: grounded analyst
- Tools: metric/SQL/chart patch
- Memory: glossary embeddings

---

### 4. Data Flow

1. User selects KPI
2. Agent runs tools + returns structured explanation/patch
3. UI previews; user accepts; audit persists

---

### 5. Agent Interaction (AG-UI)

Single analyst agent; optional narrator subgraph. CopilotKit mirrors focus + thread.

---

### 6. Scaling Considerations

- BFF horizontal
- Read replicas
- Preaggregates

---

### 7. Failure Handling

- Warehouse timeout → partial narrative flag
- Invalid patch rejected in UI

---

### 8. Observability

- Trace dashboard_id + selection fingerprint
- Log query hashes

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Product Analytics Copilot Dashboard**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- SelectionState is canonical; server mirrors each turn
- No optimistic numbers without server ack

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
