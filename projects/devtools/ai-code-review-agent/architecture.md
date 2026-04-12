### 1. System Overview

The AI Code Review Agent is a **webhook-driven TypeScript service** that builds a bounded **PR context bundle** (diff, related files, CI signals), runs a **tool-using LLM** with schema-constrained outputs, and publishes **deduplicated** findings to the code host. Optional **RAG** retrieves only from corpora your org allows (docs, ADRs), never from arbitrary web code.

---

### 2. Architecture Diagram (text-based)

```
GitHub App (webhooks)
        ↓
   API / Worker (Node.ts)
        ↓
   PR Context Builder  →  Blob/Git API  +  CI Artifacts API
        ↓
   Review Agent (LLM + tools)
     ↙   ↓   ↘
get_file  search_repo  get_ci_logs
        ↓
   Optional: Vector retrieval (pgvector) — ACL filtered
        ↓
   Validator + Severity calibrator
        ↓
   GitHub Checks / Review Comments API
```

---

### 3. Core Components

- **UI / API Layer:** Webhook ingress (signed), admin API for re-run and policy toggles, optional Next.js dashboard.
- **LLM Layer:** Single agent with structured finding schema; temperature low for factual tasks.
- **Agents (if any):** One primary agent; optional future specialized sub-loops behind same orchestrator.
- **Tools / Integrations:** GitHub/Octokit, CI log fetchers, repo search with path constraints, optional static analyzers invoked as tools.
- **Memory / RAG:** Embeddings index per repo or per service subtree; metadata filters for team and path.
- **Data sources:** PR payloads, git objects, CI outputs, internal markdown/docs corpora.

---

### 4. Data Flow

1. **Input:** Validate webhook signature; extract `repo`, `pr`, `base/head` SHAs; enqueue job with idempotency key `(repo, head_sha, policy_version)`.
2. **Processing:** Fetch diff and file tree; build context windows; run optional retrieval; invoke agent with tool loop budget.
3. **Tool usage:** Model requests files or logs; worker executes with timeouts; results appended to thread state.
4. **Output:** Validate JSON against schema; map to check run or review; store run record for diffing against prior comments to avoid spam.

---

### 5. Agent Interaction (if multi-agent)

This blueprint is **single-agent first**. If you add specialists later, use a **lightweight coordinator** that merges structured finding lists and enforces a single **severity policy**—avoid unconstrained agent-to-agent chat.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless workers behind a queue (SQS, BullMQ, Cloud Tasks); shard by `installation_id`.
- **Caching:** ETag-aware file fetches; cache diff parsing; cache embeddings for unchanged blobs keyed by `blob_sha`.
- **Async processing:** Always respond to webhooks quickly (202); post results asynchronously via check runs.

---

### 7. Failure Handling

- **Retries:** Exponential backoff on 5xx/secondary rate limits; never retry POST comments without idempotency keys.
- **Fallbacks:** If LLM fails, emit “degraded: rules-only” comment or skip with logged reason.
- **Validation:** Schema validation on model output; reject findings that lack line anchors or cite binary/generated paths.

---

### 8. Observability

- **Logging:** JSON logs with `pr_number`, `head_sha`, `run_id`; no raw code in logs unless explicitly allowed.
- **Tracing:** OpenTelemetry spans around each tool call and GitHub API request.
- **Metrics:** Latency histograms, token usage, tool error ratio, human dismissal rate, findings-per-PR distribution.
