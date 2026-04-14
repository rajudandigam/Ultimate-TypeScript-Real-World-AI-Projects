### 1. System Overview

Canvas workspace emits graph events; CopilotKit agent proposes validated ops; optional remote orchestrator for inventory-backed pricing.

---

### 2. Architecture Diagram (text-based)

```
Canvas UI
 -> Workspace Copilot
 -> Maps/tools
 -> (optional) travel orchestration service
```

---

### 3. Core Components

- UI: board + CopilotKit
- LLM: planning copilot
- Tools: maps/suppliers

---

### 4. Data Flow

1. Drag node
2. Client sends op intent
3. Agent proposes patch
4. Validator ensures feasibility
5. Commit version

---

### 5. Agent Interaction (AG-UI)

Session tied to trip_id; merges serialized through validator queue.

---

### 6. Scaling Considerations

- Presence per trip
- Partition long trips

---

### 7. Failure Handling

- Conflicting constraints → user choice modal
- Tool timeout → partial suggestions

---

### 8. Observability

- Trace trip_id + graph version
- Metrics on rejected ops

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Travel Planning Workspace (Interactive Builder)**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Operational transform or locked single-writer for graph mutations
- CopilotKit mirrors selection + panel state

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
- This blueprint is the **workspace shell**; pair with [`projects/travel/ai-travel-planner`](projects/travel/ai-travel-planner) if you want the multi-agent supplier orchestration brain.
