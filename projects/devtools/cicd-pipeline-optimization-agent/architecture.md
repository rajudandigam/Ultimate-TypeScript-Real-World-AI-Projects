### 1. System Overview

**Collector jobs** pull **workflow definitions** and **recent run metadata** into a **warehouse**. **CI Optimization Agent** queries tools to build a **structured plan** (parallelism, caching, splitting). **Publisher** posts PR comments or opens draft PRs per policy.

---

### 2. Architecture Diagram (text-based)

```
CI vendor APIs → timing warehouse
        ↓
Optimization Agent → YAML/log tools
        ↓
Recommendations → PR comment / draft PR
```

---

### 3. Core Components

- **UI / API Layer:** GitHub App settings, allowlisted repos, policy packs.
- **LLM layer:** Tool-using agent with schema-validated outputs.
- **Agents (if any):** Single agent v1.
- **Tools / Integrations:** CI REST APIs, log artifact fetchers (scoped), git.
- **Memory / RAG:** Cookbook embeddings; historical accepted diffs.
- **Data sources:** `*.yml` workflows, build analytics exports.

---

### 4. Data Flow

1. **Input:** Webhook or cron selects repos over SLO breach threshold.
2. **Processing:** Agent loads slowest steps aggregate + current workflow YAML.
3. **Tool usage:** Simulates proposed DAG changes heuristically; checks policy rules.
4. **Output:** Evidence-backed markdown + optional unified diff.

---

### 5. Agent Interaction (if applicable)

Single agent; merge authority remains humans (or separate protected-branch bot).

---

### 6. Scaling Considerations

- **Horizontal scaling:** Queue analyses; shard by org.
- **Caching:** Step timing aggregates per `(workflow, job, step)` fingerprint.
- **Async processing:** Deep log pulls deferred to background workers.

---

### 7. Failure Handling

- **Retries:** Vendor API 429/5xx with jitter.
- **Fallbacks:** Post timing-only report if YAML fetch blocked.
- **Validation:** YAML lint + org policy engine before any auto-commit.

---

### 8. Observability

- **Logging:** Tool error taxonomy, repos skipped for permissions.
- **Tracing:** Webhook→analysis→post spans.
- **Metrics:** p50/p95 CI duration trend, recommendation merge rate, introduced flake rate.
