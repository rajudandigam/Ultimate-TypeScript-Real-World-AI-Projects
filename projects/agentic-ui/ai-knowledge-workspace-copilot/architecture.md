### 1. System Overview

Editor selection streams to agent; patches validated; graph view queries same ACL-aware index.

---

### 2. Architecture Diagram (text-based)

```
Editor (blocks)
 -> Workspace Copilot
 -> Search/graph
 -> Postgres
```

---

### 3. Core Components

- UI: editor + CopilotKit
- LLM: patch proposer
- Tools: search/graph

---

### 4. Data Flow

1. Select blocks
2. Agent proposes patches
3. Diff preview
4. Commit version

---

### 5. Agent Interaction (AG-UI)

CopilotKit binds selection + scroll anchors; agent constrained to patch grammar.

---

### 6. Scaling Considerations

- Chunk indexing workers
- Read replicas for search

---

### 7. Failure Handling

- Large page truncation with continuation tokens
- Merge conflicts surfaced

---

### 8. Observability

- Trace page_id + patch ids
- Index freshness metrics

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Knowledge Workspace (Notion-style with Agent)**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Operational transform or CRDT for concurrent edits
- Agent reads serialized snapshot hash

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
