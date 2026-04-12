### 1. System Overview

The assistant is a **BFF service** holding OAuth tokens in a **vault**. The client talks to BFF; BFF calls providers and models. **Memory service** stores encrypted chunks with per-user keys. **Tool gateway** enforces scopes and produces **audit events** for every mutation path.

---

### 2. Architecture Diagram (text-based)

```
Client (web/mobile)
        ↓
   Personal AI BFF
        ↓
   Life Assistant Agent
     ↙    ↓    ↘
calendar tasks  email_draft
        ↓
   Memory service (encrypted retrieval)
        ↓
   User-visible response + pending confirmations
```

---

### 3. Core Components

- **UI / API Layer:** Consent screens, connector management, confirmation modals.
- **LLM layer:** Agent with structured action proposals.
- **Agents (if any):** Primary assistant; optional isolated executor for writes.
- **Tools / Integrations:** Calendar, mail, task systems via OAuth.
- **Memory / RAG:** Encrypted note index; preference tables.
- **Data sources:** User-authorized accounts only.

---

### 4. Data Flow

1. **Input:** Authenticate user; load scopes; attach session policy (read vs write).
2. **Processing:** Agent plans; for writes, create `pending_action` records awaiting confirm.
3. **Tool usage:** Execute only after user confirmation token; store audit with hashes.
4. **Output:** Return updated plan and links to created artifacts.

---

### 5. Agent Interaction (if applicable)

Single user-facing agent. Optional **executor** service is not conversational—it applies approved actions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; per-user sharding for hot memory partitions.
- **Caching:** Short TTL for read-only calendar snapshots; never cross-user cache.
- **Async processing:** Heavy imports (email backfill) as background jobs.

---

### 7. Failure Handling

- **Retries:** Provider retries with backoff; surface partial failures clearly.
- **Fallbacks:** Read-only mode if vault or token unhealthy.
- **Validation:** Schema validation on actions; recipient allowlists for email sends.

---

### 8. Observability

- **Logging:** Action types, success/fail, no raw message bodies by default.
- **Tracing:** Trace connector calls; correlate with `user_id` internally only.
- **Metrics:** Confirmation latency, revoke events, connector error taxonomy.
