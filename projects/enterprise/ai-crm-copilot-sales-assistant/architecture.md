### 1. System Overview

Users authenticate via **SSO** into a **CRM Copilot BFF** that holds OAuth tokens to CRM vendors. **Indexer** (optional) syncs notes/transcripts into a **vector store** with **record-level ACLs**. **Copilot Agent** calls **CRM REST tools** and retrieval; **write executor** applies mutations with idempotency keys and audit.

---

### 2. Architecture Diagram (text-based)

```
CRM UI extension / web panel
        ↓
   Copilot BFF (SSO + CRM OAuth)
        ↓
   CRM Copilot Agent
     ↙   ↓   ↘
  fetch  search  draft_actions
        ↓
   Policy + DLP gate
        ↓
   CRM APIs + audit store
```

---

### 3. Core Components

- **UI / API Layer:** Side panel, approval modals for emails/tasks, admin policy console.
- **LLM layer:** Tool-using agent with structured action proposals.
- **Agents (if any):** Single session agent.
- **Tools / Integrations:** Salesforce/HubSpot/etc., email draft provider, calendar.
- **Memory / RAG:** Deal-scoped retrieval index; session summaries.
- **Data sources:** CRM objects, call recordings metadata, uploaded files (governed).

---

### 4. Data Flow

1. **Input:** User selects account; client sends `account_id` + intent.
2. **Processing:** BFF verifies ownership/visibility; loads compact timeline facts.
3. **Tool usage:** Agent retrieves chunks and proposes actions; writes go through policy gate.
4. **Output:** Render suggestions with deep links; persist audit entries for compliance.

---

### 5. Agent Interaction (if applicable)

Single agent. Async **research jobs** can append notes to the same thread state without a second chat persona.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; separate indexing workers; read replicas for search.
- **Caching:** Hot account summaries with short TTL; invalidate on CRM webhooks.
- **Async processing:** Large doc summarization off interactive path.

---

### 7. Failure Handling

- **Retries:** CRM API retries with jitter; circuit breakers per tenant.
- **Fallbacks:** Read-only mode if write scopes revoked mid-session.
- **Validation:** Schema validation on all tool args; reject cross-tenant ids.

---

### 8. Observability

- **Logging:** Action types, policy outcomes, CRM error codes (no email bodies in logs by default).
- **Tracing:** Trace `session_id` / `account_id` with redaction.
- **Metrics:** Suggestion acceptance rate, time-to-first action, API quota usage, DLP block rate.
