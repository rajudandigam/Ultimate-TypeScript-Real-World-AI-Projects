System Type: Agent  
Complexity: Level 3  
Industry: E-commerce  
Capabilities: Multimodal, Retrieval  

# Visual Search & Style Matching Engine

## 🧠 Overview
A **multimodal commerce agent** that turns **customer photos or screenshots** into **embedding-backed product retrieval** plus **style explanations** (“similar silhouette / palette”)—grounded in **catalog metadata** and **merchant policy** (no counterfeit claims). Results are **ranked + filterable**; the model does not invent SKUs.

---

## 🎯 Problem
Text search fails for fashion and home goods; customers abandon when they cannot find “something like this image.” You need **visual similarity** that still respects **inventory truth** and **brand safety**.

---

## 💡 Why This Matters
- **Pain it removes:** Low conversion on inspiration-driven shopping, manual merchandising of “shop the look,” and noisy generic recommendations.
- **Who benefits:** Marketplaces, D2C apparel, and furniture retailers with large visual catalogs.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The agent composes **queries** and **filters** (`vector_search`, `facet_filter`, `explain_attributes`) rather than trusting free-form SKU guesses.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Multimodal embeddings + catalog RAG + session context; L4+ adds multi-agent split (vision tagger vs ranker) and large-scale realtime indexing.

---

## 🏭 Industry
Example:
- E-commerce / fashion / home

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (visual + metadata hybrid)
- Planning — bounded (refine query from negative feedback)
- Reasoning — bounded (attribute alignment explanations)
- Automation — optional merchant rules engine
- Decision making — bounded (diversity vs relevance tradeoffs)
- Observability — **in scope**
- Personalization — optional session prefs (sizes, brands)
- Multimodal — **in scope**

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js** storefront or **Node.js** BFF
- **Vector DB** (pgvector, OpenSearch kNN)
- **CLIP / SigLIP**-class embedding service (managed or self-hosted)
- **OpenAI SDK** or **Vercel AI SDK** for agent orchestration
- **OpenTelemetry**, **CDN** image transforms

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Visual Search & Style Matching Engine** (Agent, L3): prioritize components that match **agent** orchestration and the **ecommerce** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- Shopify / commerce platform Admin API
- Stripe
- Review / feed APIs for social proof

### Open Source Building Blocks
- **OpenAI Agents SDK** — default for tool-first agents with structured outputs and eval hooks.
- **LangChain.js** — when mixing many retrievers, parsers, or non-OpenAI providers behind one agent API.
- **Vercel AI SDK** — when the primary UX is streaming chat / structured streaming in Next.js.
- **TypeScript + Zod** — tool I/O and external JSON must be schema-validated at boundaries.
- **Postgres** — system of record for runs, users, audit; **Redis** for rate limits, locks, ephemeral session.
- **pgvector on Postgres** — default retrieval store when you already run Postgres; keeps ACL and backup story simple.
- **Qdrant** (self-host or cloud) — when vector-only workloads need horizontal scaling; **Pinecone** when fully managed vectors are worth the cost.
- **OpenTelemetry + OTLP** — traces/metrics/logs regardless of vendor LLM.
- **Vitest** — fast unit tests for pure functions, schema validators, and prompt-less parsers.
- **Playwright** — end-to-end smoke on critical UI / API flows once a surface exists.

### Stack Choice Guide
- **Best default:** Next.js or Hono API + OpenAI Agents SDK + Postgres + Redis + Zod — covers most single-agent and hybrid patterns in this repo.
- **Lightweight:** Serverless functions + hosted Redis + single Postgres instance; defer vector DB until retrieval metrics justify it.
- **Production-heavy:** Split read/write paths, canary prompts, online evals, feature flags for tool enablement, and isolated worker roles for risky tools.

### Buildability Notes
- **Weekend-first:** schema definitions (Zod), one happy-path tool, stub external APIs, minimal UI or CLI, structured JSON logging.
- **Defer to production:** perfect multi-region, advanced eval grids, full RBAC models — add once core flows and metrics exist.
- **Essential vs optional:** validated tool I/O + persistence for runs are essential; secondary integrations and fancy embeddings are optional until the core loop proves value.

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Image upload, URL fetch (allowlisted domains), “more like this” chip.
- **LLM layer:** Agent plans retrieval and narrates matches from tool JSON only.
- **Tools / APIs:** Embedding service, vector search, inventory/pricing APIs, policy filters.
- **Memory (if any):** Short session click feedback; optional signed-in style profile.
- **Output:** Ranked product cards + “why matched” bullets tied to attributes.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- kNN on catalog embeddings only; no LLM.

### Step 2: Add AI layer
- LLM explains top results using retrieved attribute JSON.

### Step 3: Add tools
- Add hybrid keyword filters, stock-aware ranking, merchant boost rules.

### Step 4: Add memory or context
- Negative signals (“hide puffer coats”) update retrieval plan for session.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist agents for **trend vs classic** split tests (A/B behind flags).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human relevance judgments; NDCG@k on labeled query sets.
- **Latency:** p95 image→results on mobile networks.
- **Cost:** Embedding + LLM $ per session; GPU amortization.
- **User satisfaction:** Add-to-cart lift, exit rate after visual search.
- **Failure rate:** NSFW uploads, wrong category leakage, OOS top ranks.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Fabricates materials or certifications; mitigated by **tool-backed** attributes only in copy.
- **Tool failures:** Embedding service outage; mitigated with text fallback from OCR tags.
- **Latency issues:** Huge images; mitigated with server-side downscale and progressive loading.
- **Cost spikes:** Viral traffic; mitigated caching of embeddings per sku_id.
- **Incorrect decisions:** IP-sensitive “dupes”; mitigated legal blocklists and similarity thresholds.

---

## 🏭 Production Considerations

- **Logging and tracing:** Trace retrieval ids; avoid storing raw user photos beyond retention policy.
- **Observability:** Zero-result rate, toxic image block rate, index freshness lag.
- **Rate limiting:** Per IP/user; CAPTCHA on abuse patterns.
- **Retry strategies:** Backoff on embedding provider; degrade gracefully.
- **Guardrails and validation:** CSAM scanning pipeline, PII in screenshots policy, brand compliance review for generated copy.
- **Security considerations:** Signed upload URLs, SSRF-safe URL fetchers, WAF, tenant isolation for marketplaces.

---

## 🚀 Possible Extensions

- **Add UI:** Camera-first mobile flow with crop + mask tools.
- **Convert to SaaS:** Multi-tenant visual commerce API.
- **Add multi-agent collaboration:** Stylist agent + inventory agent with arbitration rules.
- **Add real-time capabilities:** Live video frames (high cost; policy heavy).
- **Integrate with external systems:** PIM, DAM, Algolia/ES hybrid search.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **pure retrieval quality** before conversational merchandising.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Multimodal retrieval** in commerce
  - **Grounded** “why matched” explanations
  - **Safety and IP** constraints in visual AI
  - **System design thinking** for shopper-facing agents
