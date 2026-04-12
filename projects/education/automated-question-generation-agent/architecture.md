### 1. System Overview

**Ingest service** stores **source documents** with rights metadata. **Indexer** chunks text with stable **paragraph ids**. **Question Agent** generates **items** referencing paragraph ids. **Validator** checks schema, answer keys, and similarity to bank. **Exporter workflow** builds **QTI** and optionally pushes to LMS.

---

### 2. Architecture Diagram (text-based)

```
Source doc → chunk index → Question Agent
        ↓
Validation + dedupe → review queue → export (QTI/LMS)
```

---

### 3. Core Components

- **UI / API Layer:** Blueprint editor, reviewer UI, version history.
- **LLM layer:** Tool-using or structured-output generation.
- **Agents (if any):** Single agent default; optional checker agent.
- **Tools / Integrations:** Vector dedupe, LMS APIs, OCR pipeline.
- **Memory / RAG:** Course item bank embeddings; exemplar retrieval.
- **Data sources:** Instructor uploads, OER texts (licensed), learning objectives.

---

### 4. Data Flow

1. **Input:** Upload + blueprint JSON (counts, types, tags).
2. **Processing:** Index document; agent generates batch per blueprint slice.
3. **Tool usage:** Dedupe vs bank; validate; attach rationales and citations.
4. **Output:** Persist draft items; notify reviewers; on approval enqueue export job.

---

### 5. Agent Interaction (if applicable)

Single agent per generation job; human publish gate.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch jobs per course; GPU OCR optional pool.
- **Caching:** Paragraph embeddings reused across generation runs until doc changes.
- **Async processing:** Large exports and LMS pushes asynchronous with status polling.

---

### 7. Failure Handling

- **Retries:** Export retries with idempotency keys to LMS.
- **Fallbacks:** If generation fails mid-batch, return partial with explicit missing slots.
- **Validation:** Hard reject items missing citations when policy requires.

---

### 8. Observability

- **Logging:** Generation batches, rejection codes, export outcomes.
- **Tracing:** Upload→items→export spans.
- **Metrics:** Items/hour, review pass rate, psychometric stats post-administration (pipeline).
