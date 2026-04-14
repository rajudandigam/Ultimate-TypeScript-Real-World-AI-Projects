### 1. System Overview

CopilotKit sits inside the CRM console; BFF mediates CRM/KB tools with ticket-scoped tokens.

---

### 2. Architecture Diagram (text-based)

```
Agent UI (Next)
 -> BFF
 -> Support Copilot
 -> CRM + KB
```

---

### 3. Core Components

- UI: ticket workspace + CopilotKit
- LLM: drafting agent
- Tools: CRM/KB

---

### 4. Data Flow

1. Select ticket
2. Fetch context tools
3. Stream draft + citations
4. Agent edits then sends via host

---

### 5. Agent Interaction (AG-UI)

Single drafting agent with guardrailed tools; human remains in the loop for send.

---

### 6. Scaling Considerations

- Shard BFF by region
- Cache KB chunks

---

### 7. Failure Handling

- Vendor 429 → backoff + partial draft
- Low confidence → ask clarifying prompts

---

### 8. Observability

- Trace ticket_id
- Log draft versions

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Customer Support Copilot Console**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Draft state in Zustand; CopilotKit co-state for thread + selection
- Server stores authoritative ticket snapshot hash

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
