### 1. System Overview

**Pack service** requests JD and competencies via ATS tools. **Question Agent** generates **structured interview JSON**. **Lint pipeline** applies legal/bias rules. **Publisher** exports to docs or ATS attachments with version id.

---

### 2. Architecture Diagram (text-based)

```
Req id → Question Agent → ATS + internal docs
        ↓
Lint → interview pack → export
```

---

### 3. Core Components

- **UI / API Layer:** Editor, approval, template library admin.
- **LLM layer:** Structured generation with optional tool calls.
- **Agents (if any):** Single agent per pack.
- **Tools / Integrations:** ATS APIs, internal wiki (scoped), PDF export.
- **Memory / RAG:** Past approved packs and competency embeddings.
- **Data sources:** JD, leveling matrix, interview policy PDFs.

---

### 4. Data Flow

1. **Input:** User selects role family + interview type + time budget.
2. **Processing:** Fetch authoritative JD revision id; retrieve competencies.
3. **Tool usage:** Generate sections; run lint; if fail, repair within retry cap.
4. **Output:** Save `pack_vN`; share link to hiring panel with ACL.

---

### 5. Agent Interaction (if applicable)

Single agent; no access to candidate PII unless explicitly scoped for a scheduled interview.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async export jobs for large panels.
- **Caching:** JD snapshots by revision id; competency chunks rarely change.
- **Async processing:** PDF rendering in worker queue.

---

### 7. Failure Handling

- **Retries:** ATS read backoff; fail pack generation with actionable error codes.
- **Fallbacks:** Offer reduced pack from templates if tools unavailable.
- **Validation:** JSON schema for questions; enforce max counts per section.

---

### 8. Observability

- **Logging:** Lint outcomes, model version, export success.
- **Tracing:** Req→pack latency.
- **Metrics:** Human edit rate, time saved per req, incident reports on inappropriate content (target ~0).
