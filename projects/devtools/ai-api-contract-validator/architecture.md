### 1. System Overview

Validation runs as a **CI job** or **webhook** that fetches two contract versions, runs a **deterministic semantic diff engine**, then optionally invokes an **LLM agent** to classify and narrate findings using **only** the diff artifact as primary evidence. The merge gate consumes a **machine-readable** report.

---

### 2. Architecture Diagram (text-based)

```
PR / publish event
        ↓
   Validator service
        ↓
   Spec fetch + parse (swagger-parser)
        ↓
   Semantic diff engine → diff JSON
        ↓
   Contract Review Agent (tools: query diff, fetch guidelines)
        ↓
   Rule engine merge (deterministic overrides)
        ↓
   Check run / annotations / artifact upload
```

---

### 3. Core Components

- **UI / API Layer:** PR checks, optional portal for browsing spec history.
- **LLM layer:** Agent for explanation and severity suggestions constrained by diff IDs.
- **Agents (if any):** Single review agent.
- **Tools / Integrations:** Git provider, artifact storage, optional analytics for endpoint traffic.
- **Memory / RAG:** Internal standards docs; labeled historical PRs.
- **Data sources:** OpenAPI/AsyncAPI YAML/JSON, protobuf-to-OpenAPI exports, gateway configs.

---

### 4. Data Flow

1. **Input:** Receive base and head spec locations; resolve to parsed AST objects.
2. **Processing:** Compute structured diff; dedupe findings; assign stable IDs per change.
3. **Tool usage:** Agent queries diff slices and policy snippets; emits annotated list referencing IDs.
4. **Output:** Merge agent output with deterministic failures; publish unified report JSON + UI summary.

---

### 5. Agent Interaction (if applicable)

Single agent. Optional secondary **security linter** as separate non-LLM rule pack or isolated agent with read-only tools.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless validator workers; parallelize diff by tag/path for huge APIs.
- **Caching:** Memoize parse + diff by content hash; reuse when only metadata changes.
- **Async processing:** Very large specs analyzed async with pending check state.

---

### 7. Failure Handling

- **Retries:** Network fetch retries for remote specs; checksum validation.
- **Fallbacks:** If LLM unavailable, still fail/pass from deterministic rules with minimal template text.
- **Validation:** Reject agent output referencing unknown diff IDs; cap narrative length for UI.

---

### 8. Observability

- **Logging:** Spec hashes, diff counts, model latency; scrub PII-like examples from logs.
- **Tracing:** Span per parse, diff, model call; propagate `pr_number`.
- **Metrics:** False positive/negative rates from reviewer labels, parser error rate, check latency.
