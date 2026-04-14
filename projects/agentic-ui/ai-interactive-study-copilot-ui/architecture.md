### 1. System Overview

Lesson selection streams to tutor agent; questions render as structured components; mastery updated via tools.

---

### 2. Architecture Diagram (text-based)

```
Lesson UI
 -> BFF
 -> Study Copilot
 -> Content + mastery DB
```

---

### 3. Core Components

- UI: lesson + CopilotKit
- LLM: tutor
- Tools: content/mastery

---

### 4. Data Flow

1. Highlight text
2. Agent generates items
3. Learner answers
4. Mastery tool updates
5. Explain

---

### 5. Agent Interaction (AG-UI)

CopilotKit binds selection + quiz panel; difficulty policy server-side.

---

### 6. Scaling Considerations

- Warm cache for popular lessons
- Async generation for large classes

---

### 7. Failure Handling

- Generation timeout → fallback items bank
- Policy violation → block

---

### 8. Observability

- Trace lesson_id
- Item difficulty drift metrics

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Learning Copilot (Interactive Study UI)**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Quiz state in Zustand; server authoritative for grading
- Optimistic UI only for non-graded hints

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
- Minimize student PII in prompts; parental controls where required.
