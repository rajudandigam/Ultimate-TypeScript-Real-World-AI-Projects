System Type: Agent  
Complexity: Level 4  
Industry: E-commerce  
Capabilities: Recommendation  

# AI Shopping Assistant (Conversational Commerce)

## 🧠 Overview
A **storefront-embedded shopping agent** that helps customers **discover** products via **natural language**, grounds recommendations in **live catalog tools** (availability, size, price, shipping), and supports **checkout-adjacent** actions only through **hosted payment flows**—avoiding “the model invented a SKU” and **PCI** pitfalls by never handling PAN in the LLM path.

---

## 🎯 Problem
Search boxes miss intent (“gift for a baker under $50 waterproof”). Static filters frustrate. LLM-only shops hallucinate products. You need **tool-backed** catalog retrieval, **policy filters** (age-gated items), and **conversion** instrumentation.

---

## 💡 Why This Matters
- **Pain it removes:** Low discovery conversion, high bounce on complex catalogs, and overloaded human chat for repetitive questions.
- **Who benefits:** DTC brands, marketplaces, and B2B distributors with large SKU counts.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Conversational commerce maps to **one shopper session agent** with product search tools, cart tools, and **human handoff** for exceptions.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 4. Multi-tool retrieval, **personalization within consent**, and **guardrails** for regulated goods—L5 adds global scale, fraud prevention, and full accessibility compliance programs.

---

## 🏭 Industry
Example:
- E-commerce (conversational discovery, guided selling, support deflection)

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — **in scope** (product copy, FAQs, policy pages)
- Planning — bounded (multi-step gift flows)
- Reasoning — bounded (compare options with explicit attributes from tools)
- Automation — optional (add-to-cart intents validated server-side)
- Decision making — bounded (rank SKUs by fit score from structured features)
- Observability — **in scope**
- Personalization — optional (past purchases with consent; segment boosts)
- Multimodal — optional (image search via vector index of catalog images)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js + React** (chat widget + SSR product pages)
- **Node.js + TypeScript** BFF
- **Postgres** / **OpenSearch** (catalog search + vectors)
- **Shopify Storefront API** / **CommerceTools** / custom catalog
- **OpenAI SDK** (tool calling)
- **Stripe** Checkout (hosted) for payments
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Chat widget, voice (optional), session id, locale.
- **LLM layer:** Agent orchestrates search, facets, comparisons.
- **Tools / APIs:** `search_products`, `get_product`, `get_inventory`, `add_line_item` (server validates), `create_checkout_session`.
- **Memory (if any):** Session preferences; avoid storing PAN; cart state server-side.
- **Output:** Rich messages with product cards deep-linking to PDP.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Keyword search + templated responses; no LLM.

### Step 2: Add AI layer
- LLM re-ranks top 20 search results from tool JSON only.

### Step 3: Add tools
- Add vector + facet hybrid search; inventory checks per variant.

### Step 4: Add memory or context
- Store style preferences as structured fields; optional signed-in history.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional specialist for **regulated** categories with stricter tool allowlist.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Human eval of recommendation relevance on labeled intents; wrong SKU rate.
- **Latency:** p95 chat turn latency including search.
- **Cost:** Tokens per session; search infra cost per conversion.
- **User satisfaction:** Conversion lift, AOV changes, return rate monitoring.
- **Failure rate:** Hallucinated products, cart corruption, policy violations (age, geo).

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Nonexistent variants; mitigated by only showing tool-returned SKUs with live links.
- **Tool failures:** Search index stale; mitigated by freshness banners and fallback keyword path.
- **Latency issues:** Large catalogs; mitigated by two-stage retrieve then rerank.
- **Cost spikes:** Unbounded chit-chat; mitigated by session budgets and goal detection.
- **Incorrect decisions:** Upselling incompatible accessories; mitigated by compatibility graph tools and conservative defaults.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log SKU ids and tool outcomes; minimize PII; fraud signals on rapid cart changes.
- **Observability:** Search zero-result rate, add-to-cart funnel, checkout abandonment, model refusal reasons.
- **Rate limiting:** Per IP/session; bot protection; inventory reservation rules.
- **Retry strategies:** Idempotent cart APIs; safe checkout session creation.
- **Guardrails and validation:** Block medical claims; age gates; geo restrictions; content moderation on user uploads in chat.
- **Security considerations:** PCI scope minimization (hosted checkout), CSRF on cart mutations, prompt-injection via product titles (sanitize context).

---

## 🚀 Possible Extensions

- **Add UI:** Split view chat + dynamic product carousel.
- **Convert to SaaS:** Embeddable widget with merchant theming and analytics.
- **Add multi-agent collaboration:** Stylist agent + deals agent under supervisor (optional).
- **Add real-time capabilities:** Live inventory and flash sale timers in tool payloads.
- **Integrate with external systems:** OMS, loyalty, reviews (Bazaarvoice), CRM for logged-in users.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Prove **search relevance + cart safety** before proactive selling aggressiveness.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Tool-grounded** merchandising
  - **Checkout security** boundaries for LLMs
  - **Conversion instrumentation** for chat UX
  - **System design thinking** for storefront AI
