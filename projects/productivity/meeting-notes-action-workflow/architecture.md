### 1. System Overview

Transcripts enter a **workflow engine** that executes typed steps with retries. LLM calls are **side-effect free** until a validation gate passes. External mutations happen only through **server-owned** integration clients with OAuth tokens.

---

### 2. Architecture Diagram (text-based)

```
Transcript source (webhook / upload)
        ↓
   Normalize + segment
        ↓
   Workflow engine
   ├─ Rules (fast path)
   ├─ LLM extract (schema)
   ├─ Dedupe search → Notion/Jira
   └─ Create/update tasks
        ↓
   Audit DB (Postgres)
        ↓
   Notifications (Slack/email)
```

---

### 3. Core Components

- **UI / API Layer:** Ingest API, operator approval UI, replay tools for support.
- **LLM layer:** Versioned prompts producing structured action lists.
- **Agents (if any):** None required; optional micro-agent for Q&A only.
- **Tools / Integrations:** Notion/Jira, directory lookup, duplicate search.
- **Memory / RAG:** Optional embeddings for dedupe; short TTL cache of recent tasks.
- **Data sources:** Transcripts, calendar metadata, team routing config.

---

### 4. Data Flow

1. **Input:** Authenticate source; persist transcript reference; compute `meeting_id` + chunk hashes.
2. **Processing:** Rules extract obvious actions; LLM fills gaps; validate people and dates against tools.
3. **Tool usage:** Search duplicates; create tasks with idempotency keys; attach transcript excerpt citations.
4. **Output:** Emit summary record with links; notify stakeholders.

---

### 5. Agent Interaction (if applicable)

Not multi-agent. Optional interactive agent must still route writes through the same **workflow commit** API.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition queues by tenant; scale workers independently.
- **Caching:** Cache Notion DB metadata; cache directory lookups briefly.
- **Async processing:** Large meetings processed in chunks with checkpointing.

---

### 7. Failure Handling

- **Retries:** Transient API errors; not for schema validation failures without human fix.
- **Fallbacks:** Route to manual triage queue with pre-filled draft tasks.
- **Validation:** JSON schema; business rules (due dates, assignee existence); redaction pass.

---

### 8. Observability

- **Logging:** `workflow_run_id`, step timings, connector status codes.
- **Tracing:** Trace LLM and outbound API spans with tenant id.
- **Metrics:** End-to-end lag, auto-create vs human-queue ratio, duplicate prevented count.
