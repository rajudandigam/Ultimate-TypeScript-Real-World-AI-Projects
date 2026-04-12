System Type: Agent  
Complexity: Level 3  
Industry: DevTools  
Capabilities: Reasoning, Prediction, Retrieval  

# PR Risk Analyzer

## 🧠 Overview
A **tool-using agent** that estimates **merge risk** for a pull request by combining diff signals, test/CI outcomes, ownership churn, and **retrieval** over historical merges and incidents—outputting a **scored report** with evidence, not a binary “LGTM.”

---

## 🎯 Problem
Teams merge with incomplete signal: flaky CI, huge diffs touching critical modules, or changes that historically correlate with rollbacks. Existing dashboards show *current* CI status but rarely quantify **blast radius** or **novelty** relative to org history without manual archaeology.

---

## 💡 Why This Matters
- **Pain it removes:** Surprise production incidents after “green CI,” opaque risk for on-call, and inconsistent judgment across reviewers.
- **Who benefits:** Release managers, platform SREs, and repos with high merge velocity that still need **calibrated** caution.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Risk scoring is a **single coherent decision** over a bounded evidence bundle. A single agent with tools (history search, blame, dependency graph snippets) keeps accountability and simplifies evaluation versus a committee of agents.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Historical PR and incident text becomes **retrieval context**, but scores must cite **structured** facts (files touched, modules, authors) wherever possible.

---

## 🏭 Industry
Example:
- DevTools (merge queues, release governance, developer portals)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (past PRs, postmortems, change records)
- Planning — light (checklist of risk dimensions)
- Reasoning — **in scope**
- Automation — optional (block/queue labels; policy-gated)
- Decision making — **in scope** (risk score + drivers, advisory)
- Observability — **in scope**
- Personalization — optional (per-service risk weights)
- Multimodal — optional

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript**
- **GitHub/GitLab APIs** (diffs, checks, reviews, merge history)
- **OpenAI Agents SDK** or **Vercel AI SDK** with tools
- **Postgres + pgvector** (PR/incident embeddings) or managed search
- **OpenTelemetry**
- **Next.js** (risk report UI on top of JSON artifact)

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** PR webhook or merge-queue “risk gate” API with `repo`, `sha`, base branch.
- **LLM layer:** Agent proposes hypotheses; final score computed from **weighted structured features** plus model-assisted calibration (documented).
- **Tools / APIs:** Fetch diff stats, CODEOWNERS coverage, test file mapping, historical revert search, dependency metadata.
- **Memory (if any):** Vector retrieval over merged PR descriptions and incident writeups filtered by service tags.
- **Output:** Versioned risk artifact: score, top factors, citations, recommended actions (more tests, canary, extra reviewer).

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic risk score from diff size, touched paths, and CI red/green.

### Step 2: Add AI layer
- LLM explains deterministic score in prose (no extra authority).

### Step 3: Add tools
- Add tools for history: similar diffs, prior incidents for touched modules.

### Step 4: Add memory or context
- Embed and retrieve historical merges labeled with outcomes (revert, hotfix).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist for dependency risk only if evaluation shows measurable lift vs one agent with more tools.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** AUC / calibration of score vs post-merge incidents within N days.
- **Latency:** p95 time for merge-queue gate budget (often seconds to low tens).
- **Cost:** Tokens + retrieval per PR; must stay sub-linear in monorepo size via summarization.
- **User satisfaction:** Reviewer agreement rate, reduction in surprise incidents, false “high risk” annoyance.
- **Failure rate:** Tool timeouts, missing history, score variance across runs for same SHA.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Claimed incidents that never happened; mitigated by citations to ticket IDs and retrieved excerpts only.
- **Tool failures:** Incomplete blame or missing CODEOWNERS; mitigated by explicit “unknown” buckets in score.
- **Latency issues:** Large diffs; mitigated by summarization passes and incremental indexing.
- **Cost spikes:** Re-embedding every PR; mitigated by incremental updates keyed by `patch_id`.
- **Incorrect decisions:** Blocking merges unfairly; mitigated by advisory mode, appeals workflow, and per-repo calibration.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store feature vector + model version per score for reproducibility.
- **Observability:** Track score distribution, gate latency, override reasons.
- **Rate limiting:** Per repo and per author to prevent abuse as reconnaissance.
- **Retry strategies:** Backoff on VCS APIs; idempotent scoring keyed by `(repo, head_sha, policy_version)`.
- **Guardrails and validation:** Never leak private repo contents across tenants; redact secrets from retrieved text.
- **Security considerations:** Treat retrieved incidents as sensitive; RBAC on who can see scores and evidence.

---

## 🚀 Possible Extensions

- **Add UI:** Timeline of risk drivers across pushes on the same PR.
- **Convert to SaaS:** Hosted merge intelligence with org-wide policy packs.
- **Add multi-agent collaboration:** Separate security diff agent with merged evidence object.
- **Add real-time capabilities:** Live score updates as checks complete (websocket).
- **Integrate with external systems:** LaunchDarkly linkage, deployment canary gates.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove value with transparent features first; let the model handle correlation narrative once metrics are trusted.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Risk as a product**: calibration, transparency, and appeal paths
  - **RAG** grounded in internal change history
  - **Merge-queue integration** patterns
  - **System design thinking** separating explanation from authority
