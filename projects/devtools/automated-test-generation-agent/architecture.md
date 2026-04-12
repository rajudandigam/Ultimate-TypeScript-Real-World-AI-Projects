### 1. System Overview

**CI orchestrator** receives PR events and spins a **sandbox job** with repo checkout. **Test Gen Agent** iterates: read symbols → propose patch → run targeted tests → parse failures → revise. **Policy gate** enforces path allowlists and bans dangerous patterns before posting PR comments or opening draft commits.

---

### 2. Architecture Diagram (text-based)

```
PR webhook → CI job (sandbox)
        ↓
Test Gen Agent ↔ tools: fs, ast, runner, git
        ↓
Patch artifact → review interface / draft PR
```

---

### 3. Core Components

- **UI / API Layer:** PR bot, optional web review for big patches.
- **LLM layer:** Tool-using agent with iteration caps.
- **Agents (if any):** Single agent v1.
- **Tools / Integrations:** Git provider API, test runner, coverage parser, linter.
- **Memory / RAG:** Repo chunk index built per commit SHA.
- **Data sources:** PR diff, coverage lcov, historical merged tests corpus.

---

### 4. Data Flow

1. **Input:** `pr_number`, base/head SHAs, changed file list.
2. **Processing:** Build lightweight index for touched packages; seed prompts with diff hunks.
3. **Tool usage:** Apply patch in workspace; run `pnpm test --filter ...`; feed stderr/stdout back.
4. **Output:** Unified diff + summary comment with commands to reproduce locally.

---

### 5. Agent Interaction (if applicable)

Single agent loop; human merges—no auto-merge without policy exception.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue per tenant; prioritize small PRs for fast feedback.
- **Caching:** Per-commit index artifacts in object storage.
- **Async processing:** Long jobs checkpoint progress to resume after preemption.

---

### 7. Failure Handling

- **Retries:** Transient runner failures; do not mask real test failures with retries beyond N.
- **Fallbacks:** Post partial plan + manual TODO list if budget exhausted.
- **Validation:** AST parse must succeed; tests must be deterministic seeds documented.

---

### 8. Observability

- **Logging:** Tool latency, runner exit codes, patch size metrics.
- **Tracing:** Span per iteration; attribute model version.
- **Metrics:** Merge rate of suggestions, introduced flake rate, coverage delta distribution.
