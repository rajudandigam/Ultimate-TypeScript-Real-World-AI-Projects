### 1. System Overview

Clients request a briefing for `(chain_id, proposal_id)`. A **workflow** fetches chain state and optional simulations, stores **normalized facts** in Postgres, and optionally pulls forum threads into an **object store** + **search index**. The **governance agent** queries tools and emits a **structured briefing document** versioned per proposal update.

---

### 2. Architecture Diagram (text-based)

```
User / delegate UI
        ↓
   Governance API
        ↓
   Fact fetch workflow (RPC + explorer)
        ↓
   Forum ingest (optional) → index
        ↓
   Governance Agent (tools: decode, balances, search)
        ↓
   Briefing store + notifications
```

---

### 3. Core Components

- **UI / API Layer:** Proposal browser, preferences, feedback on factual errors.
- **LLM layer:** Briefing agent with citation requirements.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** RPC providers, simulation APIs, forum APIs.
- **Memory / RAG:** User preferences and saved briefings.
- **Data sources:** Chain, forums, official docs mirrors (licensed).

---

### 4. Data Flow

1. **Input:** User selects proposal; system resolves latest on-chain version.
2. **Processing:** Decode calldata; fetch relevant events; retrieve top forum chunks by embedding similarity.
3. **Tool usage:** Agent fills a structured schema: actors, assets moved, risks, unknowns.
4. **Output:** Render briefing; log provenance links; allow user corrections to improve future prompts (governed).

---

### 5. Agent Interaction (if applicable)

Single agent. Optional second non-interactive pass for **consistency checks** against a rubric JSON.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; separate indexer workers for forum volume.
- **Caching:** Proposal fact snapshots keyed by block height; TTL-based refresh near deadlines.
- **Async processing:** Heavy simulation runs async with notifications.

---

### 7. Failure Handling

- **Retries:** RPC provider rotation; partial briefings labeled incomplete.
- **Fallbacks:** Skip forum if unavailable; show chain-only mode banner.
- **Validation:** Schema validation; reject briefings missing “unknowns” when simulations fail.

---

### 8. Observability

- **Logging:** Tool latency, provider errors, user factual flags.
- **Tracing:** Trace `proposal_id` through fetch and agent phases.
- **Metrics:** Briefing adoption, correction rate, source coverage, RPC error taxonomy.
