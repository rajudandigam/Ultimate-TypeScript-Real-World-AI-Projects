### 1. System Overview

The **game simulation** produces a compact **state vector** each tick for NPCs marked as **LLM-driven**. A **decision service** calls the model and returns **validated intents**. **Moderation** runs on any generative text slots. **Telemetry** records decisions for tuning and incident review.

---

### 2. Architecture Diagram (text-based)

```
Game server (authoritative sim)
        ↓
   NPC state serializer
        ↓
   NPC Behavior Agent
        ↓
   Schema validator + moderation
        ↓
   Sim applies intents (animations/abilities)
        ↓
   Clients receive replicated outcomes
```

---

### 3. Core Components

- **UI / API Layer:** Designer tuning UI, liveops dashboards.
- **LLM layer:** NPC agent with tool calls for world queries.
- **Agents (if any):** One agent instance per eligible NPC (pooled budgets).
- **Tools / Integrations:** State query API, bark library, analytics.
- **Memory / RAG:** Encounter memory store; optional lore retrieval for writers’ tools (offline).
- **Data sources:** Game ECS, designer tables, match config.

---

### 4. Data Flow

1. **Input:** Serialize visible facts + designer constraints + player stimuli hashes.
2. **Processing:** Model proposes `Intent` objects referencing enumerated catalogs.
3. **Tool usage:** Optional extra queries for hidden information rules (Fog of War respected server-side).
4. **Output:** Server validates, applies, replicates; logs decision metadata.

---

### 5. Agent Interaction (if applicable)

Primarily single-agent per NPC. Squad coordination can be a lightweight **non-LLM** planner with LLM only for commander barks.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Shard decision workers by match; cap concurrent LLM NPCs per server.
- **Caching:** Cache decisions for identical state hashes within short TTL.
- **Async processing:** Non-critical flavor generation can trail gameplay slightly (careful UX).

---

### 7. Failure Handling

- **Timeouts:** Immediate fallback to scripted subtree; never stall simulation tick.
- **Fallbacks:** Reduce NPC tier dynamically under load (elite → scripted).
- **Validation:** Reject intents conflicting with quest locks or cooldowns.

---

### 8. Observability

- **Logging:** Intent distributions, moderation outcomes, model latency histograms.
- **Tracing:** Trace `match_id` + `npc_id` through decision pipeline.
- **Metrics:** Player reports per thousand NPC interactions, encounter completion rates, provider error rates.
