### 1. System Overview

UI sliders emit ScenarioParams; BFF runs deterministic kernels; agent narrates and proposes constrained tweaks.

---

### 2. Architecture Diagram (text-based)

```
Planner UI
 -> BFF sim kernels
 -> Finance Copilot
 -> Plaid/ledger DB
```

---

### 3. Core Components

- UI: CopilotKit + charts
- LLM: narrator/planner
- Tools: sim + ingest

---

### 4. Data Flow

1. Slider change debounced
2. Server recomputes
3. Agent streams explanation + optional tweak cards
4. User accepts

---

### 5. Agent Interaction (AG-UI)

CopilotKit binds ScenarioParams; agent cannot mutate numbers without tool outputs.

---

### 6. Scaling Considerations

- Worker pool for Monte Carlo batches
- Cache scenarios by param hash

---

### 7. Failure Handling

- Stale bank data → banner
- Conflicting goals → ask user

---

### 8. Observability

- Track recompute cost
- Model refusal reasons

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Financial Planning Copilot Dashboard (Interactive)**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Zustand for slider state; server authoritative on money numbers
- Optimistic text only, not balances

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
- Treat balances as sensitive; never send full account numbers to the model; use aggregate tools.
