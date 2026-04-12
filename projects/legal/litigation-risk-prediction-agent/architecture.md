### 1. System Overview

**Matter workspace** enforces **ACLs** at index time and query time. **Research Agent** retrieves documents via **scoped search tools** and writes **memo JSON** with citations. **Export service** renders documents inside **DLP** boundaries; **access audit** records every view and download.

---

### 2. Architecture Diagram (text-based)

```
Matter corpus (indexed) → Research Agent
        ↓
Scoped search + timeline tools
        ↓
Draft memo (citations) → attorney workstation
```

---

### 3. Core Components

- **UI / API Layer:** Matter console, redaction preview, export controls.
- **LLM layer:** Tool-using agent with strict citation schema.
- **Agents (if any):** Single agent baseline; optional specialist agents later.
- **Tools / Integrations:** eDiscovery APIs (read), spreadsheet readers, internal outcome DB (privileged).
- **Memory / RAG:** Per-matter vector index; no global cross-client mixing.
- **Data sources:** Pleadings, discovery, transcripts (policy gated).

---

### 4. Data Flow

1. **Input:** Authenticate user to matter; verify need-to-know group.
2. **Processing:** Agent plans queries; fetch top passages with offsets.
3. **Tool usage:** Assemble timeline tables from extracted dates and docket entries.
4. **Output:** Draft memo stored as new version with hash; watermark “draft.”

---

### 5. Agent Interaction (if applicable)

Single agent per session; session tokens bound to one `matter_id`.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard indices per matter; heavy jobs isolated from interactive.
- **Caching:** Query result caches with short TTL and matter-scoped keys.
- **Async processing:** OCR and indexing pipelines decoupled from chat latency.

---

### 7. Failure Handling

- **Retries:** Search retries; never return other matters’ snippets on error paths—fail closed.
- **Fallbacks:** If model unavailable, return search hit list without synthesis.
- **Validation:** Citation span validator ensures offsets exist in source documents.

---

### 8. Observability

- **Logging:** Minimal content logging; access events and performance metrics prioritized.
- **Tracing:** Query→memo spans inside secure boundary.
- **Metrics:** Time-to-memo, citation validation failures, export counts (alerting on anomalies).
