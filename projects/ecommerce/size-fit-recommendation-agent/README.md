System Type: Agent  
Complexity: Level 3  
Industry: E-commerce  
Capabilities: Prediction, Personalization  

# Size & Fit Recommendation Agent

## 🧠 Overview
A **fit copilot** that predicts **size distributions** (not a single magical size) from **self-reported measurements**, **brand-specific size charts**, **return feedback**, and **optional garment attributes**—always framing results as **probabilities** and **fit notes**. It **does not** override merchant size charts; it **interprets** them with explicit uncertainty.

---

## 🎯 Problem
Sizing drives returns and support load; naive “buy medium” bots ignore **brand skew**, **fabric stretch**, and **body shape** proxies available from lightweight quizzes.

---

## 💡 Why This Matters
- **Pain it removes:** Return shipping costs, negative reviews citing fit, and sizing chart abandonment.
- **Who benefits:** Apparel retailers, especially multi-brand marketplaces with heterogeneous charts.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

The agent gathers structured inputs via tools (`get_size_chart`, `get_sku_attributes`, `get_historical_return_rate`) and returns a **calibrated recommendation object** validated by schema.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Combines **tabular/ML signals** with **LLM explanation** and **RAG** over size-guide PDFs; L4+ adds separate try-on vision models with stricter governance.

---

## 🏭 Industry
Example:
- E-commerce / fashion

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — size guide snippets and care/fit copy
- Planning — bounded (which questions to ask next)
- Reasoning — bounded (map measurements to chart rows)
- Automation — optional auto-select size with explicit user confirm
- Decision making — bounded (size distribution + confidence)
- Observability — **in scope**
- Personalization — shopper profile + past purchases
- Multimodal — optional future: body photos (high risk; not v1 default)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js** PDP integration
- **Node.js** BFF + **OpenAI SDK** (structured outputs)
- **Postgres** for anonymized return outcomes and calibration tables
- **Bandit/ML** service (Python acceptable) for ranking sizes; TS orchestrates
- **OpenTelemetry**

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Size & Fit Recommendation Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **ecommerce** integration surface.

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

- **Input (UI / API / CLI):** Fit quiz, height/weight/inseam, brand preference, garment category.
- **LLM layer:** Agent explains recommendations using tool JSON + calibrated scores.
- **Tools / APIs:** Size charts, SKU attributes, inventory by size, return rates by sku×size.
- **Memory (if any):** Optional shopper profile with consent; session quiz state.
- **Output:** Recommended primary size + alternates + fit caveats.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Deterministic mapping table per brand category.

### Step 2: Add AI layer
- LLM explains chart rows chosen from tool-provided rows only.

### Step 3: Add tools
- Pull live charts from PIM; include stretch and fit model metadata.

### Step 4: Add memory or context
- Learn from aggregate return signals; avoid storing sensitive body data beyond policy.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional **vision try-on** agent behind separate consent + moderation stack.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Return rate delta by category; calibration error on held-out orders.
- **Latency:** p95 quiz→recommendation on mobile.
- **Cost:** LLM + feature store reads per session.
- **User satisfaction:** Fewer exchanges, higher PDP conversion.
- **Failure rate:** Recommend OOS sizes, contradict explicit user constraints, insensitive copy.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Invented measurements or chart rows; mitigated by **row ids from tools only**.
- **Tool failures:** Missing chart for new SKU; mitigated with conservative “ask human” path.
- **Latency issues:** Heavy ML service; mitigated async scoring with skeleton UI.
- **Cost spikes:** Repeated retries; mitigated caps and caching of chart parses.
- **Incorrect decisions:** Harmful body commentary; mitigated templated supportive language and content review.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log size decision codes, not raw body measurements if policy forbids.
- **Observability:** Return reasons tagged to recommendations; drift monitors when new brands onboard.
- **Rate limiting:** Per PDP views; protect ML endpoints.
- **Retry strategies:** Idempotent recommendation requests keyed by session + sku.
- **Guardrails and validation:** Disallow medical claims; include inclusive sizing copy guidelines.
- **Security considerations:** Consent banners, data minimization, regional privacy (GDPR minors), secure deletion.

---

## 🚀 Possible Extensions

- **Add UI:** Visual chart overlay linking measurement inputs to rows highlighted.
- **Convert to SaaS:** Fit API for partners with signed webhooks.
- **Add multi-agent collaboration:** “Fabric specialist” micro-agent for technical outerwear.
- **Add real-time capabilities:** Live inventory nudges when primary size is low stock.
- **Integrate with external systems:** Loop/Narvar return analytics, 3D garment APIs.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **transparent uncertainty** before any biometric or photo features.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Calibration** and honest uncertainty in UX
  - **Combining ML + LLM** responsibly
  - **Return analytics** as a feedback loop
  - **System design thinking** for sensitive shopper data
