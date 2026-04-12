### 1. System Overview

The packer runs as a **library + worker** model: synchronous **fast path** (truncate, reorder, dedupe) and asynchronous **slow path** (summaries). Policies are **versioned configs** loaded at runtime with OTel instrumentation for each stage.

---

### 2. Architecture Diagram (text-based)

```
Raw context parts
        ↓
   Token accounting
        ↓
   Dedupe + importance scoring (rules / embeddings)
        ↓
   (if over budget) Summarization worker queue
        ↓
   Final packed prompt + dropped manifest
        ↓
   LLM call
```

---

### 3. Core Components

- **UI / API Layer:** Policy editor, simulation against recorded sessions (redacted).
- **LLM layer:** Summarization micro-model calls in workers.
- **Agents (if any):** None required.
- **Tools / Integrations:** Optional embedding service for semantic dedupe.
- **Memory / RAG:** Summary cache by content hash; rolling thread summaries table.
- **Data sources:** Chat history, tool traces, retrieval chunks, pinned system instructions.

---

### 4. Data Flow

1. **Input:** Receive typed context list + route policy + model tokenizer profile.
2. **Processing:** Compute token totals; apply inclusion order; dedupe identical tool outputs.
3. **Tool usage:** If over budget, enqueue summarization jobs or use precomputed rolling summary pointers.
4. **Output:** Produce packed messages array compatible with provider APIs + debug manifest for internal users.

---

### 5. Agent Interaction (if applicable)

Not applicable as conversational multi-agent; summarization is a **batch model call**, not an autonomous agent.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Worker pool for summarization; stateless packer in app servers.
- **Caching:** Aggressive reuse of summaries for stable historical segments.
- **Async processing:** Precompute summaries on message append for chat products.

---

### 7. Failure Handling

- **Retries:** Summarization retries with smaller windows on timeouts.
- **Fallbacks:** Hard truncation with explicit marker when summarization unavailable.
- **Validation:** Never drop messages tagged `must_keep`; validate final token count before send.

---

### 8. Observability

- **Logging:** Per-stage token deltas; policy version; summarizer model id.
- **Tracing:** Span `context_pack` around LLM parent span.
- **Metrics:** Average reduction ratio, summarization queue lag, downstream task success delta.
