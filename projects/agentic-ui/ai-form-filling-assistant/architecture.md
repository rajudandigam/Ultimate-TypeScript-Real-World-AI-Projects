### 1. System Overview

The **form host** exposes a **schema registry** (fields, types, sensitivity, validators). User actions send **events** to a **Form Assistant BFF**. The **assistant agent** returns **patch proposals**; a **validation service** runs Zod/OpenAPI checks; accepted patches merge into **controlled client state** (or server draft store).

---

### 2. Architecture Diagram (text-based)

```
React form + schema registry
        ↓
   Assistant BFF
        ↓
   Form Assistant Agent
        ↓
   Patch proposal (JSON)
        ↓
   Server/client validators → apply or reject
```

---

### 3. Core Components

- **UI / API Layer:** Inline suggestions, diff review modal, accessibility announcements.
- **LLM layer:** Structured extraction agent.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Enrichment APIs, OCR workers, directory lookups.
- **Memory / RAG:** Draft store; optional glossary retrieval.
- **Data sources:** User paste/upload, org reference data.

---

### 4. Data Flow

1. **Input:** User provides text or selects “autofill from profile.”
2. **Processing:** Agent proposes `{ fieldId, value, confidence, evidence }[]`.
3. **Tool usage:** Optional `validate_address`, `fetch_company` calls before merge.
4. **Output:** Host merges; re-run validators; surface inline errors; log audit for sensitive changes.

---

### 5. Agent Interaction (if applicable)

Single agent. **Validators** are not agents—they are deterministic gates.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; scale OCR workers independently.
- **Caching:** Reference data caches (countries, currencies) with long TTL.
- **Async processing:** Large document extraction as background job with websocket progress.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; partial proposals labeled incomplete.
- **Fallbacks:** Manual entry always available; disable assistant per tenant flag.
- **Validation:** Reject entire patch if any field fails policy (atomic sections optional).

---

### 8. Observability

- **Logging:** Patch acceptance rate, sensitivity-tier touches, OCR failures.
- **Tracing:** Trace `draft_id` through extraction and validation.
- **Metrics:** Completion funnel, time-to-submit, human correction rate per field, cost per application.
