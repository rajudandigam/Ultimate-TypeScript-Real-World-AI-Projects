### 1. System Overview

Shoppers interact with a **chat widget** calling a **Commerce BFF**. **Session store** tracks cart and preferences. **Shopping agent** calls **catalog tools** backed by search indices and **OMS** for inventory. **Checkout** is created via **hosted payment** redirect; no card data touches LLM services.

---

### 2. Architecture Diagram (text-based)

```
Web storefront
        ↓
   Commerce BFF (session)
        ↓
   Shopping Agent
     ↙   ↓   ↘
search  PDP  cart/checkout
        ↓
   Product cards + checkout URL
```

---

### 3. Core Components

- **UI / API Layer:** Chat UI, product cards, human handoff to support.
- **LLM layer:** Tool-using shopping agent.
- **Agents (if any):** Single shopper-facing agent.
- **Tools / Integrations:** Search, recommendations, cart, promotions engine, Stripe Checkout.
- **Memory / RAG:** Session prefs; FAQ/policy retrieval; optional signed-in purchase history (consent).
- **Data sources:** Catalog, pricing, inventory, reviews metadata.

---

### 4. Data Flow

1. **Input:** User message + locale + session id; attach cart snapshot hash.
2. **Processing:** Agent issues search with extracted constraints (price band, category).
3. **Tool usage:** Fetch product details; verify stock; propose add-to-cart with server validation.
4. **Output:** Render structured message; on checkout intent, return hosted checkout URL from payment tool.

---

### 5. Agent Interaction (if applicable)

Single agent. **Human support** receives structured handoff with last tool results.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; scale search replicas; cache hot PDP snippets for agent context caps.
- **Caching:** Query result caches with short TTL; CDN for product media.
- **Async processing:** Personalization feature recomputation offline.

---

### 7. Failure Handling

- **Retries:** Search retries; checkout creation retries with idempotency keys.
- **Fallbacks:** Keyword-only search if vector path unhealthy.
- **Validation:** Server rejects cart mutations violating inventory reservations or max qty rules.

---

### 8. Observability

- **Logging:** Tool latency, checkout creation outcomes, search filters used (aggregated).
- **Tracing:** Trace `session_id` through BFF and agent (PII minimized).
- **Metrics:** Add-to-cart rate, checkout conversion, zero-result searches, cost per session, moderation blocks.
