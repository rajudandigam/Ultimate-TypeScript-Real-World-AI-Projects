### 1. System Overview

**Webhook ingress** normalizes provider events into **canonical message records**. **Router workflow** classifies and assigns **SLA timers**. If confidence is low, **agent activity** drafts a response proposal stored as **pending_send**. **Approval step** (human or policy) releases **send worker** which calls provider APIs via **vaulted tokens**.

---

### 2. Architecture Diagram (text-based)

```
Mail provider webhooks
        ↓
   Normalize + dedupe
        ↓
   Router workflow (rules + scores)
        ↓
   [uncertain] → Email Agent (tools: KB, ticket)
        ↓
   DLP scan → approval gate
        ↓
   Outbound send + audit
```

---

### 3. Core Components

- **UI / API Layer:** Review inbox, macro editor, policy admin.
- **LLM layer:** Drafting agent invoked only on routed branches.
- **Agents (if any):** Single primary agent per ambiguous thread.
- **Tools / Integrations:** Graph/Gmail, ticketing, CRM, Slack notifications.
- **Memory / RAG:** Thread summaries; KB index with ACLs.
- **Data sources:** Mailbox content, internal docs, customer entitlements.

---

### 4. Data Flow

1. **Input:** Receive message; thread; attachments metadata.
2. **Processing:** Rules engine assigns labels; if uncertain, call agent with bounded context window.
3. **Tool usage:** Agent may retrieve KB chunks, create internal ticket, never send without approval token.
4. **Output:** Persist draft; notify reviewer; on approve, send and update thread state.

---

### 5. Agent Interaction (if applicable)

Single agent per escalation. Optional **translation** micro-step as deterministic service, not a second chat agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition consumers by mailbox shard; scale agent workers separately.
- **Caching:** KB retrieval caches per tenant; short-lived thread summaries.
- **Async processing:** Attachment text extraction in parallel activities.

---

### 7. Failure Handling

- **Retries:** Provider API retries with jitter; never duplicate send without idempotency key.
- **Fallbacks:** Route to human queue if DLP or model unavailable.
- **Validation:** Block sends missing mandatory disclaimers for regulated content.

---

### 8. Observability

- **Logging:** Classification distribution, approval latency, send failures (codes only).
- **Tracing:** Trace `thread_id` through router, agent, DLP, send.
- **Metrics:** Auto-resolution rate, human edit rate, false positive DLP blocks, webhook lag.
