### 1. System Overview

The **grid host** maintains workbook state and exposes a **query API** for range metadata, **formula AST**, and **aggregates**. The **copilot BFF** forwards user questions to the **Spreadsheet Agent** with **tool budgets**. **Eval worker** runs in an isolated environment returning **numeric summaries** and **error codes** only.

---

### 2. Architecture Diagram (text-based)

```
Web spreadsheet client
        ↓
   Copilot BFF
        ↓
   Spreadsheet Agent
     ↙    ↓     ↘
 parse  stats  lint
        ↓
   Op proposal (JSON diff)
        ↓
   Client preview → apply/undo
```

---

### 3. Core Components

- **UI / API Layer:** Chat side panel, op preview modal, dependency graph.
- **LLM layer:** Tool-using agent emitting validated ops.
- **Agents (if any):** Single agent; optional read-only auditor in parallel for risk flags.
- **Tools / Integrations:** AST parser, eval sandbox, stats engine, export to CSV.
- **Memory / RAG:** Workbook assumption dictionary; optional methodology RAG.
- **Data sources:** In-browser or server-backed sheet model.

---

### 4. Data Flow

1. **Input:** User selects ranges and asks a question; client sends compact topology + samples.
2. **Processing:** Agent calls parse/lint/stats tools to gather facts.
3. **Tool usage:** Agent proposes ops; server validates references and circularity before returning.
4. **Output:** Client renders diff; on accept, applies ops and updates undo stack; logs audit event.

---

### 5. Agent Interaction (if applicable)

Single conversational agent. **Auditor** can be a second non-chat scoring pass merged into the same response object.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; scale eval workers; shard large server-side workbooks by tenant.
- **Caching:** AST and stats caches keyed by `(workbook_version, range_hash)`.
- **Async processing:** Heavy analysis jobs return job ids with polling UI.

---

### 7. Failure Handling

- **Retries:** Transient model errors; never auto-retry destructive ops without user intent.
- **Fallbacks:** Explain-only mode if eval sandbox unhealthy.
- **Validation:** Reject ops referencing out-of-bounds rows/cols; cap blast radius.

---

### 8. Observability

- **Logging:** Op types, validation failures, eval exceptions (aggregated).
- **Tracing:** Trace `workbook_id` / `session_id` with content minimization.
- **Metrics:** Acceptance rate, undo rate, eval latency, tokens per accepted op, security block counts.
