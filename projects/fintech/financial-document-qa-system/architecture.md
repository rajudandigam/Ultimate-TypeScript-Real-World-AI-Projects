### 1. System Overview

Filings land in **object storage**; **ETL** chunks text and extracts tables into **structured stores**. **Q&A BFF** authenticates users and scopes corpora. **Document QA Agent** calls retrieval and numeric tools; **answer validator** checks citation presence for numeric claims.

---

### 2. Architecture Diagram (text-based)

```
Filing ingest → chunk + table ETL
        ↓
   Vector + metadata index
        ↓
   Q&A BFF (ACL)
        ↓
   Document QA Agent (tools: search, table, compute)
        ↓
   Response + citations + audit
```

---

### 3. Core Components

- **UI / API Layer:** Question console, export, admin ingestion status.
- **LLM layer:** Tool-using agent with strict citation schema.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Search, table store, ratio engine, diff across periods.
- **Memory / RAG:** Filing index; optional saved prompts (governed).
- **Data sources:** SEC filings, internal decks (permissioned).

---

### 4. Data Flow

1. **Input:** User selects document set and asks question.
2. **Processing:** Retrieve top chunks; fetch relevant tables; compute derived metrics server-side if needed.
3. **Tool usage:** Agent assembles answer JSON with `citation_ref[]`; validator rejects missing citations for numbers.
4. **Output:** Render markdown/HTML with deep links to stored page images or HTML anchors.

---

### 5. Agent Interaction (if applicable)

Single agent. **Extraction** is an offline pipeline, not a second chat agent in v1.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; shard index by ticker/time; async re-embed on new filings.
- **Caching:** Query result cache keyed by `(corpus_version, question_hash)`.
- **Async processing:** Heavy ingestion and table parsing off interactive path.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; degrade to “partial evidence” responses.
- **Fallbacks:** Keyword-only retrieval if vector index unhealthy.
- **Validation:** Schema validation on responses; clamp extreme computed ratios with flags.

---

### 8. Observability

- **Logging:** Tool hit rates, citation coverage, ingestion lag per ticker.
- **Tracing:** Trace `request_id` through retrieval and tools (PII redaction).
- **Metrics:** p95 latency, cost per question, human correction rate on pilot labels.
