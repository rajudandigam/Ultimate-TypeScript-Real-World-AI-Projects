### 1. System Overview

Comparison UI drives agent tools; structured annotations return to ATS as drafts only after human commit.

---

### 2. Architecture Diagram (text-based)

```
Recruiter UI
 -> BFF
 -> Hiring Copilot
 -> ATS + resume store
```

---

### 3. Core Components

- UI: compare panes + CopilotKit
- LLM: evidence-linked analyst
- Tools: ATS/parser

---

### 4. Data Flow

1. Select candidates
2. Fetch docs
3. Stream comparative notes
4. Recruiter accepts snippets into scorecard

---

### 5. Agent Interaction (AG-UI)

Agent outputs structured Annotation[]; host maps to UI overlays.

---

### 6. Scaling Considerations

- Async resume parsing workers
- Cache extracted text

---

### 7. Failure Handling

- Parser low confidence → ask human
- ATS rate limit → backoff

---

### 8. Observability

- Trace job_id
- Log override reasons

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Hiring Decision Copilot (Recruiter UI)**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Selected lines sent as structured spans
- CopilotKit keeps compare state

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
- Strict separation of candidate PII across tenants.
