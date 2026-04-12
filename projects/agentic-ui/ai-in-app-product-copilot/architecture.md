### 1. System Overview

The **host application** bundles a thin **Copilot SDK** that serializes **AppContext** (route, entity ids, visible schema hash) to a **BFF**. The BFF authenticates the user, attaches **tenant + RBAC claims**, and calls the **Copilot Agent**. The agent returns **validated intents**; the **host dispatcher** applies them through normal product code paths (same as clicking UI).

---

### 2. Architecture Diagram (text-based)

```
Browser (React) + Copilot SDK
        ↓
   Copilot BFF (auth + RBAC)
        ↓
   Copilot Agent (tools = product APIs)
        ↓
   JSON intents → host dispatcher
        ↓
   UI updates + audit log
```

---

### 3. Core Components

- **UI / API Layer:** Copilot panel, intent toast confirmations, audit viewer for admins.
- **LLM layer:** Tool-using agent with strict output schema.
- **Agents (if any):** Single session agent.
- **Tools / Integrations:** Internal GraphQL/REST facades mirroring user permissions.
- **Memory / RAG:** Optional help center index scoped per tenant.
- **Data sources:** Live app context snapshots, product telemetry aggregates (privacy gated).

---

### 4. Data Flow

1. **Input:** User asks a question; SDK attaches minimal context snapshot + `schema_version`.
2. **Processing:** BFF verifies session; agent plans tool calls within budgets.
3. **Tool usage:** Read tools first; write tools require elevated token or explicit user confirm in payload.
4. **Output:** Host validates intents; executes; sends outcome back for follow-up turns.

---

### 5. Agent Interaction (if applicable)

Single agent per session. Optional **offline** “macro recorder” is not a second conversational agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; sticky optional only for WS; shard agent inference by region.
- **Caching:** Short TTL for stable read tools (feature flags, field metadata).
- **Async processing:** Heavy “generate report” intents as async jobs with progress UI.

---

### 7. Failure Handling

- **Retries:** Transient model errors with bounded retries; degrade to suggested links.
- **Fallbacks:** Disable write intents automatically if dependency health checks fail.
- **Validation:** Host rejects unknown intent types and out-of-scope entity ids.

---

### 8. Observability

- **Logging:** Intent acceptance/rejection reasons, tool latency, permission denials.
- **Tracing:** Trace `session_id` / `tenant_id` with PII redaction policies.
- **Metrics:** Task completion funnel, copilot engagement, error rate by route, cost per session.
