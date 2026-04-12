System Type: Agent  
Complexity: Level 2  
Industry: E-commerce  
Capabilities: Personalization, Automation  

# Abandoned Cart Recovery Agent

## 🧠 Overview
A **messaging-first agent** that turns **cart snapshots** and **consented channels** (email/SMS/push) into **short, policy-compliant** recovery sequences—using tools to fetch **live inventory**, **eligible promos** (rule engine approved), and **unsubscribe state**. It does **not** fabricate discounts or send after opt-out.

---

## 🎯 Problem
Blunt blast campaigns annoy shoppers and violate compliance; static drips miss **stock changes** and **intent signals**.

---

## 💡 Why This Matters
- **Pain it removes:** Lost revenue from abandoned carts without increasing spam complaints.
- **Who benefits:** Growth teams at Shopify-class merchants needing **measurable**, **governed** recovery.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Sequences are **event-triggered** (cart updated, checkout started) but the **copy + timing suggestions** are agent-mediated with strict JSON outputs validated before send.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Tools + light personalization; L3+ adds cross-session memory and richer bandits across channels.

---

## 🏭 Industry
Example:
- E-commerce / growth / lifecycle marketing

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — brand voice snippets (approved)
- Planning — bounded (message sequence planning)
- Reasoning — bounded (channel choice, tone)
- Automation — ESP send via workflow executor
- Decision making — bounded (offer selection within rules)
- Observability — **in scope**
- Personalization — cart contents, locale, loyalty tier
- Multimodal — optional product images in email templates

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** + **OpenAI SDK**
- **Customer.io** / **Braze** / **Klaviyo** APIs (pick one)
- **Postgres** for experiment buckets and consent mirrors
- **Inngest** for timed sends and quiet hours
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Cart abandonment events, consent webhooks, product catalog reads.
- **LLM layer:** Agent drafts `MessagePlan[]` JSON for validator.
- **Tools / APIs:** Cart service, promo engine (read-only), inventory, ESP templates.
- **Memory (if any):** Short history of touches to enforce frequency caps.
- **Output:** Validated ESP payloads + audit log.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Fixed 3-email drip with static copy.

### Step 2: Add AI layer
- LLM personalizes subject/body within template slots.

### Step 3: Add tools
- Live stock checks; suppress if OOS; pull loyalty tier.

### Step 4: Add memory or context
- Frequency caps per user/channel; global brand quiet hours.

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Optional second agent for **SMS vs email** arbitration with orchestrated experiments.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Recovery revenue lift vs holdout; unsubscribe/spam complaint deltas.
- **Latency:** Event→first message under ESP SLO.
- **Cost:** LLM cost per thousand carts; ESP $ already baseline.
- **User satisfaction:** Support tickets referencing “too many emails.”
- **Failure rate:** Sends after unsubscribe, wrong currency/locale, prohibited categories to minors.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Fake discount codes; mitigated promo tool returning only server-issued codes.
- **Tool failures:** ESP timeout causing duplicates; mitigated idempotent `send_id` keys.
- **Latency issues:** Slow cart fetch; async planning with cancel-on-purchase hook.
- **Cost spikes:** Re-LLM on every minor cart tweak; debounce events.
- **Incorrect decisions:** Harassment via high frequency; hard caps + consent checks.

---

## 🏭 Production Considerations

- **Logging and tracing:** Log campaign ids, not full message bodies if policy forbids.
- **Observability:** Send success, bounce/complaint rates, LLM validation failures.
- **Rate limiting:** Per user and per brand; detect runaway automations.
- **Retry strategies:** Safe ESP retries; never exceed daily touch limits post-retry.
- **Guardrails and validation:** TCPA/CAN-SPAM/GDPR marketing law review; age-gated categories.
- **Security considerations:** Signed webhooks, PII minimization, encryption, RBAC for marketers.

---

## 🚀 Possible Extensions

- **Add UI:** Preview simulator showing exactly what each cohort receives.
- **Convert to SaaS:** Multi-tenant recovery with per-tenant voice packs.
- **Add multi-agent collaboration:** Creative vs compliance agents with explicit veto.
- **Add real-time capabilities:** Browse abandonment on-site nudges (separate consent).
- **Integrate with external systems:** Attentive, Postscript, WhatsApp Business where allowed.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **compliance + caps** before sophisticated personalization.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Consent-aware** lifecycle messaging
  - **Tool-grounded** offers
  - **Experimentation** on revenue paths
  - **System design thinking** for growth engineering
