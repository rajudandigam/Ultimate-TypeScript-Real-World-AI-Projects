### 1. System Overview

**Resolver webhook** marks KB candidates. **Extraction workflow** pulls ticket thread, strips PII, builds **structured facts**. **Draft workflow** calls LLM with schema. **Review workflow** assigns writers; on approval **publish workflow** pushes to CMS and indexes search.

---

### 2. Architecture Diagram (text-based)

```
Resolved ticket → extract → draft (LLM)
        ↓
Review queue → human approve → publish → search index
```

---

### 3. Core Components

- **UI / API Layer:** Writer console, diff vs ticket, rollback UI.
- **LLM layer:** Draft + headline variants; optional simplification pass.
- **Agents (if any):** Optional later; start workflow-centric.
- **Tools / Integrations:** Helpdesk API, CMS, link checker, scanner for secrets.
- **Memory / RAG:** Existing article embeddings for dedupe suggestions.
- **Data sources:** Tickets, attachments (filtered), product release notes.

---

### 4. Data Flow

1. **Input:** Ticket id + resolution tags; verify permissions.
2. **Processing:** Summarize thread; extract repro steps and error signatures.
3. **Tool usage:** Check for duplicate topics; propose merge target if found.
4. **Output:** Create draft entity; notify reviewers; track SLA timers.

---

### 5. Agent Interaction (if applicable)

Optional conversational editor agent; publishing remains explicit API step.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers per tenant; isolate heavy OCR/image pipelines.
- **Caching:** Embeddings for article corpus per locale/version.
- **Async processing:** Batch nightly digest of candidates to reduce noise.

---

### 7. Failure Handling

- **Retries:** CMS publish retries with idempotency keys.
- **Fallbacks:** If LLM fails, still create skeleton from template fields.
- **Validation:** Block publish if secret scanner flags or link rot over threshold.

---

### 8. Observability

- **Logging:** Stage transitions, rejection codes, token usage per draft.
- **Tracing:** Ticket→draft→publish latency.
- **Metrics:** Deflection delta, time-in-review, duplicate-merge rate.
