System Type: Agent  
Complexity: Level 3  
Industry: Wellness / Home nutrition  
Capabilities: Multimodal, Planning  

# Smart Fridge Meal Planner Agent

## 🧠 Overview
Uses **camera or barcode inventory** (user-initiated, privacy-gated) plus **household preferences** to propose **meals that use what is on hand**, reduce **waste near expiry**, and output **shopping deltas**—**not** medical nutrition therapy unless **licensed partner** workflow; focuses on **practical meal assembly** with **food safety timers** for leftovers.

*Catalog note:* Complements **`Weekly Grocery Optimization Agent`** (list + deals); this project is **inventory-first, fridge-vision, meal assembly**.

---

## 🎯 Problem
Food spoils behind milk cartons; people rebuy what they already have; weeknight decision fatigue defaults to delivery.

---

## 💡 Why This Matters
- **Pain it removes:** Waste, cost, and low-nutrition convenience defaults.
- **Who benefits:** Families and roommates sharing a fridge.

---

## 🏗️ System Type
**Chosen:** **Single Agent** with **vision classification tools** (on-device preferred) and **recipe RAG** from licensed sources.

---

## ⚙️ Complexity Level
**Target:** Level 3 — multimodal + inventory graph + safety copy.

---

## 🏭 Industry
Consumer health / home

---

## 🧩 Capabilities
Multimodal, Planning, Personalization, Optimization, Observability

---

## 🛠️ Suggested TypeScript Stack
React Native, on-device TFLite/CoreML classifiers, Node.js BFF, Postgres inventory graph, OpenAI SDK for recipe adaptation, USDA FoodData Central (nutrient hints), OpenTelemetry

---



<!-- stack-guidance-enriched:v1 -->

### Recommended Stack
Tailored for **Smart Fridge Meal Planner Agent** (Agent, L3): prioritize components that match **agent** orchestration and the **health-ai** integration surface.

- **Next.js (app routes) or Hono on Node** — Next when you need a UI; Hono/Fastify when the blueprint is API-first workers and you want minimal overhead.
- **OpenAI Agents SDK + Vercel AI SDK (if UI)** — tool calling + streaming without reinventing runtimes; LangChain.js if you need broader provider adapters.
- **Model SDK** — OpenAI / Anthropic official TypeScript SDKs behind a thin router so you can swap models without rewriting tools.
- **Postgres (+ pgvector when RAG is real)** — one primary datastore keeps permissions and backups simpler than fragmenting across many DBs early.
- **Redis** — queues, rate limits, idempotency keys, and short-lived OAuth/session material.
- **Observability** — OpenTelemetry + structured logs; add LangSmith/Helicone when you start tuning prompts or tools.
- **Deployment** — Vercel for Next surfaces; **Fly.io / Railway / Render / Docker on k8s** for long-lived workers, webhooks, and anything that ignores serverless timeouts.

### Suggested APIs and Integrations
Only wire what your contracts and compliance posture allow — start with **sandbox keys** and narrow scopes.

- FHIR R4 endpoints (Epic / Cerner sandboxes for build)
- HIPAA-aligned BAA vendors only for PHI

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
Fridge scan → item graph with expiry confidence → **Meal Agent** proposes 3 dinners + lunchables → user swaps → exports shopping shortfall list → optional smart oven timer links

---

## 🔄 Implementation Steps
1. Manual inventory entry MVP  
2. Barcode-first with pack size tracking  
3. Camera assist with on-device classification + cloud fallback  
4. Allergy/household profile hard constraints  
5. Leftover chain planning (Sunday roast → Monday tacos)  

---

## 📊 Evaluation
Self-reported waste reduction, plan completion rate, vision miscount rate, time-to-weekly-plan acceptance

---

## ⚠️ Challenges & Failure Cases
**Misread similar bottles**; cross-contamination suggestions for allergens; **unsafe “still good”** claims—confidence thresholds, “when in doubt throw out” copy, block raw chicken reuse suggestions without cook temp tool

---

## 🏭 Production Considerations
Camera data retention defaults (short TTL), household RBAC, minors’ privacy, affiliate-free nutrition claims discipline

---

## 🚀 Possible Extensions
Smart label OCR for deli dates with human confirm

---

## 🤖 Agent breakdown
- **Vision inventory tool:** returns item candidates + confidence + bbox (no cloud if policy says so).  
- **Constraint solver:** ensures allergens and dislikes never appear.  
- **Meal planner agent:** sequences recipes consuming soonest expiring SKUs first.

---

## 🎓 What You Learn
Multimodal home AI, inventory graphs, food-safety-conscious UX
