### 1. System Overview

Charts emit MetricSelection; agent pulls aggregates via tools; strict policy layer for medical boundaries.

---

### 2. Architecture Diagram (text-based)

```
Wellness UI
 -> BFF
 -> Wellness Copilot
 -> Metrics store
```

---

### 3. Core Components

- UI: charts + CopilotKit
- LLM: coach
- Tools: stats/aggregates

---

### 4. Data Flow

1. Select metric window
2. Agent summarizes with tools
3. Cards rendered with disclaimers

---

### 5. Agent Interaction (AG-UI)

CopilotKit binds goals + selections; policy guard intercepts clinical asks.

---

### 6. Scaling Considerations

- Nightly rollups
- Per-user encryption keys optional

---

### 7. Failure Handling

- Sparse data → wider intervals
- Provider outage → cached aggregates

---

### 8. Observability

- Trace user_id hashed
- Safety filter metrics

---

<!-- arch-stack-layers-enriched:v1 -->

### Recommended Technical Architecture
Concrete layers for **AI Personal Health Insights Dashboard (Personalized)**:

- **UI / API layer:** Next.js + CopilotKit host; Tailwind; Zod on APIs; auth at edge/BFF.
- **Orchestration layer:** OpenAI Agents SDK sessions scoped per `workspace_id`; optional LangGraph for split read/write agents.
- **Tool execution layer:** BFF proxies to CRM, warehouse, logs, maps — browser never holds vendor secrets.
- **Memory / retrieval layer:** Postgres + optional pgvector for KB/docs with ACL-aware retrieval.
- **Observability layer:** OTel from UI events through tool spans; redaction policies.
- **Auth / policy layer:** OIDC, RBAC aligned with tool allowlists; confirmations for irreversible writes.

### UI + Agent Interaction Flow
- Local-first option for sensitive reads
- Server stores aggregates not raw streams when possible

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
- Wellness UX only unless you integrate licensed clinical workflows; avoid diagnostic claims.
