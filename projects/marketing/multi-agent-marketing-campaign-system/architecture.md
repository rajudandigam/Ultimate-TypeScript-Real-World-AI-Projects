### 1. System Overview

A **supervisor service** owns the canonical **campaign document** (JSON + rendered views). The **strategist** proposes structure and hypotheses; the **copy generator** emits channel-specific text blocks referencing approved sources; the **performance analyzer** queries metrics and proposes edits as structured patches. The supervisor validates merges and enforces **publish gates**.

---

### 2. Architecture Diagram (text-based)

```
Marketer UI / API
        ↓
   Campaign Supervisor
     ↙        ↓        ↘
Strategist   Copy      Performance
 Agent       Agent      Analyzer Agent
     ↘        ↓        ↙
   Tools: CMS / lexicon / analytics / ESP drafts
        ↓
   Merge + compliance validation
        ↓
   Versioned campaign artifact → approvals → publish tools
```

---

### 3. Core Components

- **UI / API Layer:** Campaign workspace, approval queues, experiment assignment UI.
- **LLM layer:** Three role-specific agents plus optional summarizer for stakeholders.
- **Agents (if any):** Strategist, copy generator, performance analyzer.
- **Tools / Integrations:** Brand CMS, analytics warehouse, ESP/marketing automation APIs, ad platforms (optional).
- **Memory / RAG:** Past campaigns, legal snippets, product fact sheets with version pins.
- **Data sources:** CRM segments (hashed), performance reports, editorial calendars.

---

### 4. Data Flow

1. **Input:** Create campaign shell with objectives, markets, channels, and risk tier.
2. **Processing:** Strategist outputs outline + measurement plan; supervisor requests copy per channel in parallel where safe.
3. **Tool usage:** Analyzer fetches KPI snapshots; copy agent calls lexicon + fact retrieval; all outputs reference `source_id`s.
4. **Output:** Supervisor merges; validators run; human approval triggers draft publish jobs with audit bundle.

---

### 5. Agent Interaction (if multi-agent)

**Roles:** Strategist sets constraints; copy stays inside them; analyzer proposes changes grounded in numbers. **Communication:** via supervisor state keys (`outline`, `assets`, `metrics_snapshot`). **Orchestration:** merge queue serializes writes; max revision rounds; explicit reject reasons returned to agents.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless API; async workers for long analytics pulls and generation batches.
- **Caching:** Cache analytics snapshots with TTL; cache static brand chunks aggressively.
- **Async processing:** Nightly refresh jobs for always-on campaigns.

---

### 7. Failure Handling

- **Retries:** Tool retries with backoff; partial campaign save if one channel fails.
- **Fallbacks:** Revert to last approved version on publish failure; notify owners.
- **Validation:** Block publish if any claim lacks `source_id` or fails lexicon scan.

---

### 8. Observability

- **Logging:** Campaign version lineage, tool payloads (redacted), approval actor ids.
- **Tracing:** Trace each agent span under `campaign_id`.
- **Metrics:** Generation latency per channel, policy violation counts, post-publish KPI deltas tied to versions.
