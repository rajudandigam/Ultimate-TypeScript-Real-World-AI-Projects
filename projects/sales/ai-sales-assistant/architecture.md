### 1. System Overview

The assistant is a **server-side agent** behind a rep-facing UI. The browser sends **intent + entity IDs**; the server hydrates CRM objects, runs retrieval over **allowlisted** corpora, executes the model with tools, and returns **draft artifacts** stored for audit. Sending email happens through existing channels with optional **approval service** hooks.

---

### 2. Architecture Diagram (text-based)

```
Rep UI (Next.js)
        ↓
   Sales API (SSO + scopes)
        ↓
   Sales Agent (LLM + tools)
     ↙     ↓     ↘
CRM read   Playbook RAG   Calendar
        ↓
   Draft + next-action JSON
        ↓
   Approval service (optional) → Gmail/Outlook API / CRM email log
```

---

### 3. Core Components

- **UI / API Layer:** Workspace UI, approval inbox, admin policy console.
- **LLM layer:** Tool loop with budgets; structured output for tasks and email sections.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** CRM REST/GraphQL, internal CMS, calendar, sequencing tools (as permitted).
- **Memory / RAG:** Playbooks, product sheets, win/loss notes (redacted, ACL’d).
- **Data sources:** Opportunities, contacts, emails, call summaries (if integrated).

---

### 4. Data Flow

1. **Input:** Authenticate rep; resolve opportunity and allowed data scope.
2. **Processing:** Fetch CRM snapshot; retrieve top playbook chunks; build prompt with citation requirements.
3. **Tool usage:** Optional calendar checks; write draft activity to CRM as non-customer-visible until approved.
4. **Output:** Return draft + ranked next actions + missing-field checklist for rep.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional compliance pass as separate **synchronous function** (rules + small model) before returning draft to UI.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API tier; queue heavy retrieval jobs per large account.
- **Caching:** Cache static playbook embeddings by `(doc_version, chunk_id)`; short TTL on CRM snapshots per session.
- **Async processing:** Long account research precomputes background briefs for large deals.

---

### 7. Failure Handling

- **Retries:** CRM backoff; user-visible partial results when data incomplete.
- **Fallbacks:** Template-only mode if model or retrieval unavailable.
- **Validation:** Strip disallowed claims; enforce max discount language; block send API calls from model path.

---

### 8. Observability

- **Logging:** Draft ids, tool call success, policy hits; avoid raw customer PII in aggregate logs.
- **Tracing:** Trace retrieval, model, and CRM calls with `opportunity_id` baggage where allowed.
- **Metrics:** Draft acceptance rate, time-to-send, tool error ratio, compliance block counts.
