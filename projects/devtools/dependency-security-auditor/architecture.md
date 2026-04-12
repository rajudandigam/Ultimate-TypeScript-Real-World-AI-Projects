### 1. System Overview

**Ingest service** accepts SBOM/lockfile artifacts keyed by `repo@sha`. **Normalizer** builds a canonical dependency graph for **pnpm workspaces**. **Matcher** queries advisory databases and attaches metadata. **Workflow** dedupes, scores, routes tickets, and schedules **escalations** on SLA breaches.

---

### 2. Architecture Diagram (text-based)

```
CI → artifact store → matcher (OSV/advisories)
        ↓
Findings workflow → tracker + notifications
        ↘ optional LLM digest writer
```

---

### 3. Core Components

- **UI / API Layer:** Findings explorer, suppression workflow UI, policy editor.
- **LLM layer:** Optional summarization only.
- **Agents (if any):** Optional future patch-bot agent in sandbox.
- **Tools / Integrations:** OSV API, GitHub APIs, Slack, ITSM.
- **Memory / RAG:** Policy docs retrieval for engineers.
- **Data sources:** Lockfiles, SBOM JSON, EPSS feeds (optional).

---

### 4. Data Flow

1. **Input:** CI posts CycloneDX + lockfile hash after merge to default branch.
2. **Processing:** Compute new/changed packages vs prior scan artifact.
3. **Tool usage:** Query advisories; enrich with reachability flags from static graph.
4. **Output:** Upsert findings rows; open/update tickets with stable external keys.

---

### 5. Agent Interaction (if applicable)

Core path is workflow-only; optional LLM isolated behind feature flag.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition scans by org; prioritize default branches.
- **Caching:** Advisory responses by `(package, version)` tuple; negative caching.
- **Async processing:** Large graphs processed in chunked jobs with checkpoints.

---

### 7. Failure Handling

- **Retries:** Transient API errors; circuit breakers to mirrors.
- **Fallbacks:** Mark findings as stale-uncertain rather than silent drop.
- **Validation:** Schema-check SBOM; reject partial uploads missing workspace roots.

---

### 8. Observability

- **Logging:** Scan durations, match counts, suppression decisions with actor ids.
- **Tracing:** CI upload → match → ticket spans.
- **Metrics:** MTTR for criticals, duplicate ticket rate, scanner error ratio.
