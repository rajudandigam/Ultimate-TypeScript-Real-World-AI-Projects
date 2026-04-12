### 1. System Overview

PR Risk Analyzer builds a **feature bundle** from the VCS and CI systems, enriches it with **retrieved historical context**, and runs a **bounded agent** that must attach citations to every high-impact claim. A **calibration layer** (rules + learned weights) produces a merge-queue-friendly score with audit metadata.

---

### 2. Architecture Diagram (text-based)

```
Merge queue / PR webhook
        ↓
   API (auth + policy)
        ↓
   Feature extractor (deterministic)
     ↘        ↙
   Git/CI APIs    Ownership graph
        ↓
   Retrieval (pgvector / search) — incidents + PRs
        ↓
   Risk Agent (LLM + tools: history search, file stats)
        ↓
   Calibrator (rules + versioned weights)
        ↓
   Risk artifact JSON → Gate / UI / Comment
```

---

### 3. Core Components

- **UI / API Layer:** Merge gate HTTP API, dashboard for score lineage, optional GitHub check run publisher.
- **LLM layer:** Agent with tools; structured JSON for factors and citations.
- **Agents (if any):** Single primary agent.
- **Tools / Integrations:** Git provider, CI checks API, CODEOWNERS parser, dependency metadata service.
- **Memory / RAG:** Embeddings over historical PRs and incidents with strict ACL and service tags.
- **Data sources:** Diff hunks (summarized), test mapping tables, incident database.

---

### 4. Data Flow

1. **Input:** Receive PR identifiers; load policy version for repo.
2. **Processing:** Compute deterministic signals; query retrieval for top-k similar changes; assemble context pack under token budget.
3. **Tool usage:** Agent may request extra file lists or incident details; each response logged.
4. **Output:** Emit `score`, `drivers[]`, `citations[]`, `unknowns[]`; publish to gate or store for async merge.

---

### 5. Agent Interaction (if multi-agent)

Single-agent architecture. Add specialists only if you can show **orthogonal evidence** (e.g., SAST-only agent) and a deterministic merger of factor lists.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless scoring workers; cache git metadata per `head_sha`.
- **Caching:** Reuse feature bundle across retests until `head_sha` changes.
- **Async processing:** For very large repos, async mode with “pending risk” check run updating to final.

---

### 7. Failure Handling

- **Retries:** Git API retries with conditional requests; avoid thundering herds on monorepo.
- **Fallbacks:** If LLM fails, emit deterministic-only score with banner.
- **Validation:** Reject outputs missing citations for severity above threshold.

---

### 8. Observability

- **Logging:** Policy version, feature vector hash, retrieval query ids.
- **Tracing:** Span per tool call; merge-queue latency budgets.
- **Metrics:** Score drift over time, override counts, incident correlation rate post-merge.
