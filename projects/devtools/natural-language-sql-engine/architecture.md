### 1. System Overview

**API gateway** authenticates and resolves **tenant semantic layer** (allowed tables, metrics). **NL→SQL workflow** calls LLM to produce **AST/SQL**, runs **validator**, optionally **EXPLAIN**, then executes via **read-only role** with **limits**. **SQL→NL** path summarizes approved queries and small aggregated samples.

---

### 2. Architecture Diagram (text-based)

```
NL question → authZ → schema tools → LLM
        ↓
Validator → EXPLAIN/cost gate → warehouse (read-only)
        ↓
Results → NL summary + audit row
```

---

### 3. Core Components

- **UI / API Layer:** Query console, saved questions, admin policy editor.
- **LLM layer:** Generation + optional self-correction on validator errors.
- **Agents (if any):** Optional inner agent loop; outer spine is workflow.
- **Tools / Integrations:** Warehouse SQL APIs, semantic layer service, idP.
- **Memory / RAG:** Glossary index; prior approved query patterns.
- **Data sources:** dbt artifacts, information_schema exports.

---

### 4. Data Flow

1. **Input:** Parse intent; attach user entitlements and default warehouse.
2. **Processing:** Retrieve schema subset; generate candidate SQL/AST.
3. **Tool usage:** Validate; estimate cost; execute with `LIMIT` and timeouts.
4. **Output:** Tabular JSON + chart spec + citations to definitions used.

---

### 5. Agent Interaction (if applicable)

Constrained agent inside validator loop; no tool to disable checks.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; warehouse does heavy lifting.
- **Caching:** Schema snapshots per version; negative cache for bad columns.
- **Async processing:** Large queries as async jobs with polling URLs.

---

### 7. Failure Handling

- **Retries:** Retry generation on validator error up to N; never retry unsafe execution paths.
- **Fallbacks:** Ask clarifying question UI event when ambiguous grain detected.
- **Validation:** Deny multi-statement strings, comments tricks, and out-of-allowlist UDFs.

---

### 8. Observability

- **Logging:** Validator decision codes, execution ms, rows scanned (aggregated).
- **Tracing:** Request span through LLM and warehouse.
- **Metrics:** Block rate, success rate, cost per question, user override rate.
