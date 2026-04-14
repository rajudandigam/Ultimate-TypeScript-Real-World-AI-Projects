### 1. System Overview

Shelf UI events feed agent; deterministic sim kernel computes KPI deltas; agent narrates.

---

### 2. Architecture Diagram (text-based)

```
Merch UI
 -> BFF
 -> Merch Copilot
 -> Commerce + sales warehouse
```

---

### 3. Core Components

- UI: shelf + CopilotKit
- LLM: planner
- Tools: catalog/sales

---

### 4. Data Flow

1. Drag SKU
2. Compute deltas
3. Stream suggestion cards
4. Publish after approval

---

### 5. Agent Interaction (AG-UI)

Session scoped to store_id; tools read-only until publish action.

---

### 6. Scaling Considerations

- Preaggregate sales
- Partition by store

---

### 7. Failure Handling

- Inventory conflicts → blocking modal
- API 429 → graceful degrade

---

### 8. Observability

- Trace store_id
- Track suggestion uptake

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI E-commerce Merchandising Copilot Dashboard**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Shelf state optimistic with server reconciliation for placements
- Price numbers never optimistic without server

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
