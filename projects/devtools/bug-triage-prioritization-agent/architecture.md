### 1. System Overview

**Webhook receiver** validates signatures and enqueues **triage jobs**. **Triage Agent** gathers evidence via tools, emits **structured proposals**. **Policy service** decides which fields may auto-apply. **Tracker writer** applies allowed updates and posts an evidence comment.

---

### 2. Architecture Diagram (text-based)

```
Issue event → queue → Triage Agent
        ↓
tools: search, traces, deploys, codeowners
        ↓
Proposal → policy → tracker API
```

---

### 3. Core Components

- **UI / API Layer:** GitHub App/Jira plugin, admin rubric editor.
- **LLM layer:** Tool-using agent with schema-validated proposals.
- **Agents (if any):** Single agent baseline.
- **Tools / Integrations:** Issue APIs, observability vendors, git metadata.
- **Memory / RAG:** Embedding index of historical issues and postmortems.
- **Data sources:** CI results, deployment records, linked traces.

---

### 4. Data Flow

1. **Input:** Normalized issue payload with redaction pipeline.
2. **Processing:** Retrieve similar issues; fetch linked observability artifacts.
3. **Tool usage:** Assemble hypothesis list with confidence scores and citations.
4. **Output:** Comment + optional label mutations allowed by policy.

---

### 5. Agent Interaction (if applicable)

Single agent; destructive actions (close/wontfix) require elevated policy or human.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Worker pool per integration region; shard by org.
- **Caching:** Embedding index per org refreshed incrementally.
- **Async processing:** Deep investigations for large issues run deferred jobs.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on vendor APIs; DLQ with replay tooling.
- **Fallbacks:** Post “insufficient signals” with checklist for reporter.
- **Validation:** JSON schema + allowlist of labels/components.

---

### 8. Observability

- **Logging:** Redacted prompts/responses storage policy; decision audit ids.
- **Tracing:** Webhook→comment latency breakdown.
- **Metrics:** Suggestion acceptance, median time-to-first-owner, misroute rate from surveys.
