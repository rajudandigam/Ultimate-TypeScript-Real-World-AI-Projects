### 1. System Overview

**Insights ETL** lands normalized **ad performance** tables. **Creative Agent** queries slices (placement, geo, audience) and retrieves **approved asset library** entries. **Lint + brand** services validate outputs. **Publisher** posts drafts to ad libraries or returns files for manual upload.

---

### 2. Architecture Diagram (text-based)

```
Ad APIs → warehouse → Creative Agent
        ↓
Brand lint → draft assets / library upload
        ↓
Experiment tracker
```

---

### 3. Core Components

- **UI / API Layer:** Briefing console, experiment planner, rights metadata UI.
- **LLM layer:** Multimodal model for copy + image briefs; structured JSON sidecar.
- **Agents (if any):** Single agent per campaign review session.
- **Tools / Integrations:** Meta/Google/TikTok APIs (as needed), DAM, landing fetcher.
- **Memory / RAG:** Winning creative corpus with embeddings + license tags.
- **Data sources:** Spend/click/impression exports, creative hashes, policy docs.

---

### 4. Data Flow

1. **Input:** Select account, date range, KPI (CPA, ROAS), creative cluster id.
2. **Processing:** Compute fatigue signals; fetch top historical analogs.
3. **Tool usage:** Generate variants; validate claims and trademarks against registry.
4. **Output:** Attach to experiment spec; notify creative lead for final sign-off.

---

### 5. Agent Interaction (if applicable)

Single agent; live spend changes remain human or separate automation with caps.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Batch jobs per ad account; cache heavy insight queries.
- **Caching:** Creative thumbnails and metric rollups per day.
- **Async processing:** Video storyboard generation in GPU workers when used.

---

### 7. Failure Handling

- **Retries:** API throttling with exponential backoff per vendor guidelines.
- **Fallbacks:** Text-only variants if image gen disabled by policy.
- **Validation:** Reject outputs referencing products not in catalog for that account.

---

### 8. Observability

- **Logging:** Variant ids, policy violations, API error classes.
- **Tracing:** Insight pull → generation → lint spans.
- **Metrics:** Experiment win rate, time-to-next iteration, CPA delta post-change.
