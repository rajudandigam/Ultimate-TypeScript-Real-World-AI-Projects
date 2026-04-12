### 1. System Overview

**Connectors** land raw rows in a **landing zone**. **Transform engine** applies versioned mapping packs to emit **FHIR bundles**. Rows that fail validation enter an **exception queue**. A **FHIR Mapping Agent** (per steward session) proposes **typed patches** using tools; an **approval service** commits approved packs and triggers **CI regression** on fixtures before promotion.

---

### 2. Architecture Diagram (text-based)

```
Legacy sources → landing zone → transform engine
        ↓
   Validator ($validate)
        ↓
   OK → FHIR store          FAIL → exception queue
                               ↓
                        Mapping Agent (tools)
                               ↓
                     Steward approval → new mapping version
```

---

### 3. Core Components

- **UI / API Layer:** Steward console, connector admin, release promotion UI.
- **LLM layer:** Tool-using agent with strict JSON outputs for mapping edits.
- **Agents (if any):** Single primary agent; optional test-generation agent in sandbox.
- **Tools / Integrations:** FHIR server validate API, terminology server, row fetcher, git-like mapping registry.
- **Memory / RAG:** Vector index over internal IG notes and runbooks (permissioned).
- **Data sources:** HL7 v2 streams, CSV drops, REST pollers.

---

### 4. Data Flow

1. **Input:** Connector ingests batch or incremental updates with cursor checkpoints.
2. **Processing:** Normalize to a canonical row model; apply mapping pack `vN`.
3. **Tool usage:** On failure, agent retrieves validation diagnostics + relevant IG snippets; proposes patch.
4. **Output:** After approval, bump to `vN+1`; replay quarantined rows; archive lineage.

---

### 5. Agent Interaction (if applicable)

Single steward-facing agent per session. **Dual-control** optional: second human for high-risk domains (e.g., medications).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Parallel transform workers per shard key; isolate heavy tenants.
- **Caching:** Terminology expansions; embedded IG chunk caches with ETags.
- **Async processing:** Large batches via object storage + job queue; never hold huge bundles in LLM context.

---

### 7. Failure Handling

- **Retries:** Transient validator/terminology errors with jittered backoff.
- **Fallbacks:** Route to human-only queue if LLM budget exceeded or policy requires.
- **Validation:** Schema-validate agent outputs; deny patches that widen PHI scopes.

---

### 8. Observability

- **Logging:** Counts by `error_code`, mapping version adoption, steward decision latencies.
- **Tracing:** Trace connector → transform → validate for stuck-file diagnosis.
- **Metrics:** Rows/hour, fail rate by source, mean time to clear exceptions, regression test pass rate.
