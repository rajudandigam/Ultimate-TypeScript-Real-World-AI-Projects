### 1. System Overview

**Feed pollers** fetch sources on schedules, store **raw artifacts** (hash-addressed). **Parser workflow** extracts sections and metadata. **Matcher** scores internal **controls** via embeddings + rules. **Triage workflow** opens tasks with **severity** and **citations**. **Approval workflow** records human decisions to the **control register**.

---

### 2. Architecture Diagram (text-based)

```
Sources → ingest store → parse/chunk
        ↓
Match to controls → impact tickets
        ↓
Human approval → control register version bump
```

---

### 3. Core Components

- **UI / API Layer:** Analyst console, mapping editor, audit export.
- **LLM layer:** Optional structured mapping proposals with citations.
- **Agents (if any):** Optional triage copilot; core remains workflow.
- **Tools / Integrations:** ITSM, e-signature for approvals (optional), licensed reg feeds.
- **Memory / RAG:** Vector index over policies/controls with ACLs.
- **Data sources:** Regulators, industry bodies, internal policy PDFs.

---

### 4. Data Flow

1. **Input:** New artifact ingested; compute content hash; skip duplicates.
2. **Processing:** Segment text; embed sections; retrieve top-k candidate controls.
3. **Tool usage:** Attach canonical URLs + checksums to ticket payload.
4. **Output:** Route to owner queues by domain tags; escalate on deadlines.

---

### 5. Agent Interaction (if applicable)

Optional; mapping changes always versioned with approver identity.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Async workers per jurisdiction; isolate heavy PDF pipelines.
- **Caching:** Negative cache for irrelevant sections; reuse embeddings for unchanged chunks.
- **Async processing:** Nightly reconciliation digest across sources.

---

### 7. Failure Handling

- **Retries:** Fetch retries with respect to publisher limits.
- **Fallbacks:** If parser fails, still store raw file with manual triage flag.
- **Validation:** Reject mappings lacking citation spans; schema-validate ticket payloads.

---

### 8. Observability

- **Logging:** Source ids, parse versions, match scores distribution.
- **Tracing:** Ingest→ticket spans per change record.
- **Metrics:** Time-to-triage, false positive mapping rate, overdue assessments.
