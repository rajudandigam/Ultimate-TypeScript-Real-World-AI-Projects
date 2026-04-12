### 1. System Overview

Email to Task is a **queue-backed ingestion pipeline**. Each message becomes a **workflow instance** with typed stages: normalize MIME, classify intent, extract structured fields, dedupe against existing tasks, then call **Notion/Jira APIs**. LLMs sit inside **specific stages** with schemas—not as a free chat endpoint.

---

### 2. Architecture Diagram (text-based)

```
Inbound email (webhook / poll)
        ↓
   Ingress API (verify signature)
        ↓
   Workflow engine (Temporal / BullMQ)
   ├─ Parse + normalize
   ├─ Rules engine (fast path)
   ├─ LLM extract (structured JSON)
   ├─ Dedupe search → Notion/Jira query tools
   └─ Create/update task tools
        ↓
   Audit store (Postgres)
        ↓
   Optional: Notify Slack / email ack
```

---

### 3. Core Components

- **UI / API Layer:** Webhook receiver, operator UI for low-confidence queue, admin config for routing rules.
- **LLM Layer:** Schema-constrained extraction prompts versioned per tenant.
- **Agents (if any):** None required; optional bounded “clarification” micro-loop later.
- **Tools / Integrations:** Notion and Jira clients, duplicate search, optional CRM lookup.
- **Memory / RAG:** Thread-level cache; optional embeddings for semantic dedupe against task titles.
- **Data sources:** Raw MIME, headers (`Message-Id`, `In-Reply-To`), attachment metadata.

---

### 4. Data Flow

1. **Input:** Authenticate inbound source; persist raw payload reference; compute `idempotency_key` from `Message-Id` + destination.
2. **Processing:** Run rules; if ambiguous, call LLM extraction with truncated thread; compute confidence score.
3. **Tool usage:** Search for open tasks with similar fingerprint; create or update; link `source_message_id` in description fields.
4. **Output:** Task URL written back to audit log; optional webhook to customer systems.

---

### 5. Agent Interaction (if multi-agent)

Not multi-agent by default. If you add an “agent,” keep it **inside** the extraction step with a fixed tool budget and the workflow owning final commits to external systems.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition queues by tenant; scale workers independently of webhook receivers.
- **Caching:** Cache Notion database schemas and Jira project metadata; cache LLM results keyed by content hash for duplicate forwards.
- **Async processing:** All heavy steps async; webhook returns fast acknowledgment.

---

### 7. Failure Handling

- **Retries:** Transient 5xx from SaaS APIs; not for 4xx validation errors without fix.
- **Fallbacks:** Route to human triage queue with pre-filled draft; never infinite LLM loops.
- **Validation:** JSON schema; business rules (due date in future, assignee must exist); PII redaction pass before tool calls.

---

### 8. Observability

- **Logging:** Structured logs per `workflow_run_id`, step timings, tool status codes.
- **Tracing:** Trace LLM and outbound API spans; propagate tenant id.
- **Metrics:** End-to-end lag, extraction confidence, duplicate prevented count, DLQ depth.
