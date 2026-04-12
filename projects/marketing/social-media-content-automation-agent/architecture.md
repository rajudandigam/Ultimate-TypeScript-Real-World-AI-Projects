### 1. System Overview

**Campaign service** stores briefs and asset references. **Social Agent** generates **per-platform drafts**. **Lint pipeline** runs brand, legal, and link checks. **Scheduler workflow** publishes or queues based on policy and quiet hours.

---

### 2. Architecture Diagram (text-based)

```
Brief → Social Agent → DAM/UTM tools
        ↓
Lint → approval (optional) → scheduler → social APIs
```

---

### 3. Core Components

- **UI / API Layer:** Calendar, preview, approvals, emergency pause.
- **LLM layer:** Structured multi-post generation.
- **Agents (if any):** Single agent per generation batch.
- **Tools / Integrations:** LinkedIn/X/Meta/TikTok APIs as enabled, link shortener, analytics import.
- **Memory / RDB:** Post versions, schedules, blackout dates, performance aggregates.
- **Data sources:** Brand guidelines, campaign docs, DAM metadata.

---

### 4. Data Flow

1. **Input:** Select week + channels + CTA parameters.
2. **Processing:** Generate posts; attach media asset ids validated against DAM.
3. **Tool usage:** Lint; if fail, return actionable errors to agent within retry budget.
4. **Output:** Persist drafts or call scheduler create with idempotency keys.

---

### 5. Agent Interaction (if applicable)

Single agent; live publish requires role + feature flag.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Stateless BFF; async generation jobs for many brands.
- **Caching:** Stable brand voice snippets; reuse across weeks with version pins.
- **Async processing:** Media transcoding in separate workers when needed.

---

### 7. Failure Handling

- **Retries:** API publish retries with dedupe keys; never double-post same slot.
- **Fallbacks:** Notify humans on repeated lint failure with partial drafts saved.
- **Validation:** Enforce max lengths and forbidden unicode tricks; sanitize HTML entities.

---

### 8. Observability

- **Logging:** Publish outcomes, API error codes, lint failure taxonomy.
- **Tracing:** Generate→lint→schedule spans.
- **Metrics:** Engagement per variant, approval turnaround, incident count for misposts (target ~0).
