### 1. System Overview

**Capture client** streams audio to an **ASR service** with **consent metadata**. **Transcript worker** segments text and stores **encounter session state**. **Note Agent** calls **FHIR read tools** and **template registry** to emit a **versioned draft**. **Provider UI** shows uncertainties; **sign adapter** posts to EHR only through controlled APIs outside the model.

---

### 2. Architecture Diagram (text-based)

```
Mic client → ASR → transcript store
        ↓
Note Agent → SMART FHIR reads
        ↓
Draft store → provider UI → EHR sign API (human)
```

---

### 3. Core Components

- **UI / API Layer:** Web/Electron capture, draft review, org admin for templates.
- **LLM layer:** Tool-using agent with structured note schema + uncertainty flags.
- **Agents (if any):** Single drafting agent in v1.
- **Tools / Integrations:** FHIR read clients, template service, optional internal med spelling lexicon.
- **Memory / RAG:** Session buffer; optional vector index over style guides (non-PHI).
- **Data sources:** ASR streams, EHR FHIR API, clinic macros.

---

### 4. Data Flow

1. **Input:** Start encounter session; attach patient id + scopes after authZ.
2. **Processing:** ASR emits partials → agent updates draft sections incrementally.
3. **Tool usage:** Pull meds/problems when transcript references change; attach as structured facts.
4. **Output:** Draft `vK` saved; provider edits; sign event writes final note via EHR adapter.

---

### 5. Agent Interaction (if applicable)

Single agent. **Signing** is a hard boundary handled by authenticated human action in UI/EHR—not a model tool.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; GPU ASR pools sized separately from LLM tier.
- **Caching:** Template bodies; repeated lexicon tokens for ASR biasing where supported.
- **Async processing:** Long audio offload to batch ASR if interactive latency spikes.

---

### 7. Failure Handling

- **Retries:** ASR reconnect; LLM retries with smaller windows on context overflow.
- **Fallbacks:** If tools fail, produce **questions for provider** instead of guessing.
- **Validation:** Reject drafts that omit mandatory sections for selected template.

---

### 8. Observability

- **Logging:** Draft version transitions, tool error codes, consent ids (not raw audio).
- **Tracing:** End-to-end latency segments: capture → ASR → first token → draft complete.
- **Metrics:** Edit distance samples, uncertain span rate, sign-through rate, PHI redaction pipeline health.
