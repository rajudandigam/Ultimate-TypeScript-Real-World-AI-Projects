### 1. System Overview

**PR hook** fetches OpenAPI artifacts at **head** and **base** references. **Parser toolchain** emits normalized IR + Spectral results. **API Design Agent** queries **style guide** retrieval and emits **structured findings** with severities. **Publisher** posts inline comments and sets GitHub Check conclusion.

---

### 2. Architecture Diagram (text-based)

```
PR → fetch specs → parsers + diff engine
        ↓
API Design Agent → style guide RAG
        ↓
Findings JSON → GitHub Checks + review comments
```

---

### 3. Core Components

- **UI / API Layer:** GitHub App, optional web console for exception requests.
- **LLM layer:** Tool-using agent or single-pass structured output after tool stage.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Git provider APIs, Spectral, OpenAPI diff, semver policy config.
- **Memory / RAG:** Guideline chunks + exception registry.
- **Data sources:** `openapi.yaml`, prior release bundles, ADRs.

---

### 4. Data Flow

1. **Input:** Detect changed paths under `specs/`; load relevant files only.
2. **Processing:** Parse → lint → diff vs previous release artifact from tag.
3. **Tool usage:** Retrieve guideline snippets for failing rules; map to suggested fixes.
4. **Output:** Annotated findings with stable `rule_id` codes for analytics.

---

### 5. Agent Interaction (if applicable)

Single agent; machine diagnostics are source of truth for existence claims.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless workers; shard giant monorepos by service folder.
- **Caching:** Parse results keyed by file SHA; reuse across duplicate CI events.
- **Async processing:** Large specs analyzed in background with pending check state.

---

### 7. Failure Handling

- **Retries:** Git fetch retries; do not duplicate comments—upsert by rule+path key.
- **Fallbacks:** If LLM unavailable, post deterministic lint output only.
- **Validation:** YAML parse gates before any LLM call to save cost and confusion.

---

### 8. Observability

- **Logging:** Rule hit counts, severities, model version, spec size metrics.
- **Tracing:** PR webhook → parse → diff → LLM spans.
- **Metrics:** False positive rate from human dismiss events, time saved estimates from labels.
