### 1. System Overview

**IDE extension** captures **editor state** (URI, caret, visible imports) and calls a **local BFF** or **cloud API**. **Completion Agent** fetches **minimal context** via tools, streams tokens, and returns **structured edit ops** when needed. **Validator** optionally runs **TypeScript diagnostics** before apply.

---

### 2. Architecture Diagram (text-based)

```
Editor → BFF → Completion Agent
        ↓
tools: LSP bridge, file chunks, tsserver
        ↓
Streamed suggestion → client apply / preview
```

---

### 3. Core Components

- **UI / API Layer:** Extension host, settings UI, redaction rules.
- **LLM layer:** Streaming tool-using model.
- **Agents (if any):** Single agent per request; cancel on navigation.
- **Tools / Integrations:** Workspace reader (chrooted), symbol index, optional remote RAG.
- **Memory / RAG:** Repo chunk index; session cache only.
- **Data sources:** Open files, git diff, `tsconfig` graph.

---

### 4. Data Flow

1. **Input:** Debounced trigger with privacy tier (local-only vs cloud).
2. **Processing:** Resolve symbols; retrieve top-k chunks; assemble prompt budget.
3. **Tool usage:** Pull extra spans only if uncertainty high (policy-gated).
4. **Output:** Stream ghost text or return `WorkspaceEdit` JSON.

---

### 5. Agent Interaction (if applicable)

Single short-lived agent per suggestion lifecycle.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Regional inference endpoints; client-side caching of embeddings.
- **Caching:** Chunk embeddings keyed by git blob hash.
- **Async processing:** Background indexing jobs separate from interactive path.

---

### 7. Failure Handling

- **Retries:** Retry stream once on transient 5xx; disable cloud on repeated failure.
- **Fallbacks:** Local regex/snippet templates when offline.
- **Validation:** Reject edits touching `.env` or keychain paths per policy.

---

### 8. Observability

- **Logging:** Aggregate suggestion acceptance, not raw code (unless opted-in).
- **Tracing:** Debounce→first-token spans per session id.
- **Metrics:** p95 latency, cancellation rate, diagnostic regression rate post-apply.
