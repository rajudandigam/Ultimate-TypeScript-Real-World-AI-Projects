### 1. System Overview

**Campaign BFF** authenticates marketers and loads **brand packs**. **Sequence Agent** retrieves facts via tools and emits **ESP payload JSON**. **Lint service** enforces compliance and token safety. **Publisher** pushes drafts or live sends per policy.

---

### 2. Architecture Diagram (text-based)

```
Brief + segment → Sequence Agent → CRM/tools
        ↓
Lint + brand rules → ESP draft / review queue
```

---

### 3. Core Components

- **UI / API Layer:** Editor, approval flow, experiment assignment.
- **LLM layer:** Tool-using agent with structured sequence schema.
- **Agents (if any):** Single agent default.
- **Tools / Integrations:** CRM, warehouse, ESP, link shortener (allowlisted).
- **Memory / RAG:** Case study and messaging library index.
- **Data sources:** Product docs, persona sheets, prior campaign performance.

---

### 4. Data Flow

1. **Input:** Validate segment and consent flags; freeze merge field schema.
2. **Processing:** Sample representative contacts for preview; generate master template + variants.
3. **Tool usage:** Validate URLs and claims against allowlist; fetch dynamic snippets per variant rules.
4. **Output:** Upload to ESP as draft; store version hash for rollback.

---

### 5. Agent Interaction (if applicable)

Single agent per campaign generation job.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers per large segment; dedupe identical prompts via content hashing.
- **Caching:** Embeddings for static docs; reuse across variants.
- **Async processing:** Bulk personalization fields resolved in ETL before LLM pass where possible.

---

### 7. Failure Handling

- **Retries:** ESP API backoff; partial upload recovery with reconcile job.
- **Fallbacks:** Static fallback template if lint repeatedly fails.
- **Validation:** HTML sanitizer; block external pixel injections not on allowlist.

---

### 8. Observability

- **Logging:** Lint failure taxonomy, model version, send suppressed reasons.
- **Tracing:** Generate→lint→publish spans.
- **Metrics:** Reply rate, complaint rate, time-to-approve, cost per 1k recipients.
