### 1. System Overview

The assistant is a **TypeScript API** that orchestrates an LLM **tool loop** over a **query execution service**. The execution service compiles requests into SQL/DSL using **allowlisted metadata**, runs through **RLS-enforced** credentials, enforces **LIMITS** and **timeouts**, and returns truncated results to the model for explanation. All queries are **audited**.

---

### 2. Architecture Diagram (text-based)

```
Analyst UI
        ↓
   Analytics API (SSO + entitlements)
        ↓
   Query Assistant Agent
     ↙     ↓     ↘
describeMetric  proposeQuery  runQuery (wrapped)
        ↓
   SQL validator / EXPLAIN gate
        ↓
   Warehouse (RLS role) → Result sample
        ↓
   Explanation + chart spec → UI
```

---

### 3. Core Components

- **UI / API Layer:** Chat + table/chart view, saved questions, admin policy console.
- **LLM layer:** Agent producing structured query artifacts, not only strings.
- **Agents (if any):** Primary assistant; optional validator micro-loop.
- **Tools / Integrations:** Semantic layer APIs, warehouse drivers, catalog metadata service.
- **Memory / RAG:** Metric glossary, approved query library, dashboard context snippets.
- **Data sources:** Curated tables/views exposed to the assistant principal only.

---

### 4. Data Flow

1. **Input:** User question + scope; resolve allowed datasets and metric versions.
2. **Processing:** Retrieve relevant definitions; propose parameterized SQL AST; validate against allowlist and type rules.
3. **Tool usage:** EXPLAIN + execute with caps; if too expensive, refuse with suggested narrower question.
4. **Output:** Return rows + visualization spec + explanation referencing metric ids; persist audit record.

---

### 5. Agent Interaction (if applicable)

Single-agent default. Validator can be **deterministic** code first; add LLM validator only if it improves measured defect rate.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; isolate heavy queries to dedicated pool; cache metadata aggressively.
- **Caching:** Cache identical validated queries briefly keyed by `(user_scope, normalized_question)`.
- **Async processing:** Large exports as async jobs with signed download links.

---

### 7. Failure Handling

- **Retries:** Transient warehouse errors; cancel long-running queries server-side.
- **Fallbacks:** Offer prebuilt report links if generation fails.
- **Validation:** Reject any query referencing non-allowlisted objects; enforce date window defaults.

---

### 8. Observability

- **Logging:** Query fingerprints, scan stats, policy denials; avoid logging result payloads.
- **Tracing:** Trace tool calls and warehouse execution with `question_id`.
- **Metrics:** Blocked query reasons distribution, median scan bytes, user satisfaction signals.
