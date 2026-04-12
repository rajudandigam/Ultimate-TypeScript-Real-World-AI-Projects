### 1. System Overview

**Migration controller** reads a **manifest** and builds a **dependency wave graph**. **Workflow engine** executes waves: apply codemod → open/update PR → wait for required checks → merge or hold. **State DB** tracks per-package status and rollback pointers.

---

### 2. Architecture Diagram (text-based)

```
Manifest → wave planner → per-package workflows
        ↓
Codemod runner → PR → CI gates → merge queue
        ↘ rollback workflow on SLO breach
```

---

### 3. Core Components

- **UI / API Layer:** Operator console, exception approvals, audit log.
- **LLM layer:** Optional failure explainer; optional edge-case patch suggester (reviewed).
- **Agents (if any):** Optional; core is workflow.
- **Tools / Integrations:** Git provider, CI, package graph builder, registry APIs.
- **Memory / RAG:** Playbook retrieval; historical incident notes.
- **Data sources:** `package.json` workspaces, lockfiles, CI configs.

---

### 4. Data Flow

1. **Input:** Register migration version + target scope (paths/teams).
2. **Processing:** Compute shards; enqueue first wave tasks idempotently.
3. **Tool usage:** Run codemod container; push branch; attach CI labels.
4. **Output:** Update status; notify owners; trigger rollback on policy trip.

---

### 5. Agent Interaction (if applicable)

Optional copilot for triage; no autonomous merge without policy unless explicitly configured with heavy guardrails.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Worker pool per region; shard by repo.
- **Caching:** Codemod container image layers; incremental `tsc` caches per PR.
- **Async processing:** Long-running tests as child workflows with timeouts.

---

### 7. Failure Handling

- **Retries:** CI re-run policies with capped attempts; quarantine chronic flakes.
- **Fallbacks:** Freeze wave; open incident ticket with diff bundle attached.
- **Validation:** AST parse must succeed post-transform; reject empty hunks.

---

### 8. Observability

- **Logging:** Wave ids, PR URLs, codemod hashes, merge outcomes.
- **Tracing:** End-to-end migration span per package.
- **Metrics:** Lead time per wave, defect escape rate, revert rate.
