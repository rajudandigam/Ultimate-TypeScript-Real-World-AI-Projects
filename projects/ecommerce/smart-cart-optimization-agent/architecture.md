### 1. System Overview

**Checkout BFF** authenticates shoppers and proxies **cart tools** to a **Smart Cart Agent**. **Rule service** encodes merchant constraints. **Telemetry pipeline** records impressions, accepts, and dismissals for offline evaluation and bandits.

---

### 2. Architecture Diagram (text-based)

```
Storefront → Checkout BFF → Cart Agent
                 ↓
        tools: cart, catalog, rules, ship estimator
                 ↓
        Suggestions JSON → UI
```

---

### 3. Core Components

- **UI / API Layer:** Cart drawer component, feature flags, analytics beacons.
- **LLM layer:** Single tool-using agent with schema-validated outputs.
- **Agents (if any):** One agent.
- **Tools / Integrations:** Cart API, search, inventory, shipping estimator, promo read APIs.
- **Memory / RAG:** Optional playbook retrieval for tone; session store for dismissals.
- **Data sources:** PIM, OMS, carrier APIs.

---

### 4. Data Flow

1. **Input:** Cart id or session token + locale + channel.
2. **Processing:** Agent fetches cart snapshot; queries candidate SKUs via search tool.
3. **Tool usage:** Evaluate each candidate against rules; discard blocked items before user display.
4. **Output:** Render suggestions; record outcomes asynchronously.

---

### 5. Agent Interaction (if applicable)

Single agent. **Payment** and **discount application** stay in PCI-scoped services without LLM involvement.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF autoscale; isolate hot merchants.
- **Caching:** Adjacency lists for top sellers; CDN for product metadata snapshots.
- **Async processing:** Nightly jobs refresh embeddings or co-purchase stats.

---

### 7. Failure Handling

- **Retries:** Tool retries with jitter; cap LLM turns per session.
- **Fallbacks:** Hide agent UI on repeated failures; show static bundles.
- **Validation:** Server-side revalidation of suggested SKUs against latest cart version.

---

### 8. Observability

- **Logging:** Structured suggestion events with experiment bucket ids.
- **Tracing:** Breakdown cart fetch vs LLM vs search latencies.
- **Metrics:** Attach rate, incremental revenue per 1k sessions, error budgets.
