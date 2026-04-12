### 1. System Overview

The debugging assistant is a **session-based agent service** that wraps observability APIs behind **templated tools**. Each session stores **evidence objects** (query + truncated results + timestamps) separate from model prose. The UI renders both: narrative for humans, evidence for verification.

---

### 2. Architecture Diagram (text-based)

```
Engineer UI / IDE
        ↓
   Debugging API (SSO + scopes)
        ↓
   Debugging Agent
     ↙    ↓    ↘
logs   metrics   traces
     ↘    ↓    ↙
   deploys / flags / recent PRs
        ↓
   Incident memo (structured JSON + Markdown)
```

---

### 3. Core Components

- **UI / API Layer:** Chat or structured incident pane; optional VS Code webview host.
- **LLM layer:** Tool loop with iteration caps and refusal behaviors on missing data.
- **Agents (if any):** Single investigator agent in v1.
- **Tools / Integrations:** Loki-like logs, Prometheus-like metrics, Tempo-like traces, CI/CD metadata.
- **Memory / RAG:** Prior incidents and service README/runbooks retrieval.
- **Data sources:** Live telemetry only within approved time windows; no arbitrary internet fetches.

---

### 4. Data Flow

1. **Input:** User provides symptom + scope; system resolves service ownership and allowed backends.
2. **Processing:** Agent selects initial queries from templates; executes via server-side tool implementations.
3. **Tool usage:** Results normalized into evidence objects; model updates hypotheses with citations to evidence ids.
4. **Output:** Persist memo; optionally open Jira draft with embedded queries.

---

### 5. Agent Interaction (if multi-agent)

Single agent. If adding remediation, isolate it as a **different principal** with different tools and explicit human approval transitions.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; push heavy queries to worker queue per session.
- **Caching:** Short TTL cache for repeated identical queries during a session.
- **Async processing:** Long log pulls run async with partial updates streamed to UI.

---

### 7. Failure Handling

- **Retries:** Safe retries on 5xx; no blind doubling of expensive queries.
- **Fallbacks:** If a backend is down, produce partial memo with explicit gaps.
- **Validation:** Server rejects queries missing time bounds or required label filters.

---

### 8. Observability

- **Logging:** Log tool latency and row counts; avoid storing raw secrets.
- **Tracing:** Dogfood OTel: trace each tool invocation with `session_id`.
- **Metrics:** Loop count distribution, human thumbs, query cost estimates per session.
