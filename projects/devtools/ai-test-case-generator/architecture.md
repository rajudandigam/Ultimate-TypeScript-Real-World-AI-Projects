### 1. System Overview

Generation jobs are **workflow-orchestrated**: checkout snapshot → build context → model proposes patches → **sandbox compile/test** → iterate or stop. The **agent** is the iterative controller once tools exist; the workflow owns timeouts, quotas, and artifact retention.

---

### 2. Architecture Diagram (text-based)

```
Trigger (ticket / API / IDE)
        ↓
   Generator workflow (queue)
        ↓
   Context assembler (AST + specs + exemplars)
        ↓
   Test Authoring Agent
     ↙     ↓     ↘
readTree  applyPatch  runTests
        ↓
   Patch validator + policy checks
        ↓
   Draft PR / patch artifact store
```

---

### 3. Core Components

- **UI / API Layer:** Job submission, diff viewer, reviewer sign-off.
- **LLM layer:** Agent with structured patch operations and test intent schema.
- **Agents (if any):** Primary authoring agent post–Step 3.
- **Tools / Integrations:** Git, package manager, test runner, coverage exporter.
- **Memory / RAG:** Vector or lexical retrieval of nearby tests and fixtures.
- **Data sources:** Source files, OpenAPI, tickets, historical merged test PRs.

---

### 4. Data Flow

1. **Input:** Validate scope (paths, max files); snapshot commit SHA.
2. **Processing:** Build symbol graph and spec alignment; retrieve exemplar tests.
3. **Tool usage:** Apply patch in ephemeral workspace; run `tsc` + targeted tests; stream errors back.
4. **Output:** Open PR when thresholds met; otherwise fail job with actionable log bundle.

---

### 5. Agent Interaction (if applicable)

Workflow-first with a **single agent** in the loop. Multi-agent only if you isolate **security review** of generated code paths.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Pool of isolated runner workers; job queue per org.
- **Caching:** Dependency layer cache in sandboxes; reuse exemplar retrieval across jobs in same package.
- **Async processing:** Long jobs with heartbeats; partial results saved for resume.

---

### 7. Failure Handling

- **Retries:** Transient git or registry errors; not for deterministic compile failures without a new patch.
- **Fallbacks:** Offer skeleton-only PR if runner unavailable (clearly labeled).
- **Validation:** Reject patches touching generated lockfiles or secrets paths.

---

### 8. Observability

- **Logging:** Per-iteration patch hash, runner exit code, stderr size caps.
- **Tracing:** Trace model calls and runner spans with `job_id`.
- **Metrics:** Iterations-to-green distribution, sandbox OOM rate, merge rate of generated PRs.
