### 1. System Overview

**Add-in client** calls **BFF** with user intent. **Drafting Agent** fetches **thread excerpts** via provider APIs after **redaction**. **Composer service** returns streaming tokens to UI. **Send path** remains native client—no server auto-send.

---

### 2. Architecture Diagram (text-based)

```
Mail client → BFF → Drafting Agent
        ↓
Gmail/Graph read tools → redactor
        ↓
Draft stream → composer UI
```

---

### 3. Core Components

- **UI / API Layer:** Outlook/Gmail add-in, settings for tone and disclaimers.
- **LLM layer:** Streaming model with optional lightweight tool calls.
- **Agents (if any):** Single agent per draft session.
- **Tools / Integrations:** Mail APIs, optional CRM with scoped tokens.
- **Memory / RAG:** Org style snippets; user macro library.
- **Data sources:** Email threads, calendar context (optional).

---

### 4. Data Flow

1. **Input:** `thread_id`, goal, tone, locale.
2. **Processing:** Fetch messages up to budget; summarize long tails server-side.
3. **Tool usage:** Optional CRM pull for account facts if user opted in.
4. **Output:** Stream draft; store only metadata unless user saves template.

---

### 5. Agent Interaction (if applicable)

Single agent; user edits are authoritative.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Regional BFF; isolate noisy tenants.
- **Caching:** Thread summaries keyed by `(thread_id, last_message_id)`.
- **Async processing:** Heavy summarization before streaming draft.

---

### 7. Failure Handling

- **Retries:** Provider backoff; partial thread mode with banner.
- **Fallbacks:** Offer bullet outline if streaming provider down.
- **Validation:** Output filter for disallowed domains/links per org policy.

---

### 8. Observability

- **Logging:** Draft session ids, token usage, redaction triggers.
- **Tracing:** Fetch→summarize→stream latency breakdown.
- **Metrics:** Acceptance rate, policy block rate, mean edit distance.
