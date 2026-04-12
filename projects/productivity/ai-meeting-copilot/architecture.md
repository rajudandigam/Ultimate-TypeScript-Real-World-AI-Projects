### 1. System Overview

The copilot runs as a **React-embedded** experience backed by a **TypeScript API** that holds OAuth tokens and executes tools. The browser sends **minimal context** (entity IDs, not full payloads) while the server hydrates authorized data. Transcript chunks stream in; the agent emits **structured patches** to a meeting state document consumed by the UI.

---

### 2. Architecture Diagram (text-based)

```
React host app (routes, selection)
        ↓ (context + transcript chunk)
   Copilot API (authZ + tools)
        ↓
   Meeting Agent (LLM)
     ↙   ↓   ↘
 Jira tool  Notion tool  CRM note tool
        ↓
   Meeting state store (Postgres)
        ↓
   Streaming UI updates (SSE / websocket)
```

---

### 3. Core Components

- **UI / API Layer:** Side panel UI, consent modal, server routes for tool execution.
- **LLM layer:** Streaming agent with JSON fragments for decisions/actions.
- **Agents (if any):** Primary meeting agent; optional fast “chunk summarizer” later.
- **Tools / Integrations:** Work trackers, CRM, calendar APIs—server-side only.
- **Memory / RAG:** Prior meetings and project glossary retrieval with ACL.
- **Data sources:** Transcript provider, UI context resolver, user directory for assignee resolution.

---

### 4. Data Flow

1. **Input:** Client sends `meeting_id`, transcript delta, and allowed `context_handles`.
2. **Processing:** Server resolves handles to entities; builds prompt with citations requirement.
3. **Tool usage:** Agent requests creates/updates; server validates permissions and idempotency keys.
4. **Output:** Persist state; stream UI diff; emit “pending human confirm” flags when needed.

---

### 5. Agent Interaction (if multi-agent)

Single user-facing agent. If you split, use a **non-user-facing** redaction pass as a separate service, not a competing conversational agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API instances; sticky sessions only if needed for streaming; Postgres as source of truth.
- **Caching:** Cache entity metadata; avoid caching sensitive transcript text across tenants.
- **Async processing:** Post-meeting full reconcile job for drift correction vs live suggestions.

---

### 7. Failure Handling

- **Retries:** Tool retries with idempotency; transcript gaps logged as explicit unknowns.
- **Fallbacks:** If model down, show raw transcript search UI and queue extraction.
- **Validation:** Block outbound emails or customer-visible writes without confirmation tier.

---

### 8. Observability

- **Logging:** Tool audit trail with actor, meeting, and redacted payloads.
- **Tracing:** End-to-end from transcript arrival to task URL creation.
- **Metrics:** Suggestion acceptance rate, time-to-first-action, consent opt-in rate.
