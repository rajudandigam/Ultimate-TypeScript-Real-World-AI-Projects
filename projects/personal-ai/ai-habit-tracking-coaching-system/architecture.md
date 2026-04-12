### 1. System Overview

Clients send **check-in events** to an ingestion API stored in **Postgres time-series tables**. A **coaching worker** periodically generates messages using an **agent** that reads aggregates via tools. Notifications are delivered through a **queue** with delivery receipts.

---

### 2. Architecture Diagram (text-based)

```
Mobile / Web client
        ↓
   Events API → Postgres
        ↓
   Coaching scheduler
        ↓
   Coaching Agent (tools: stats, reminders)
        ↓
   Policy + moderation gate
        ↓
   Push / email notifications
```

---

### 3. Core Components

- **UI / API Layer:** Check-in UX, goal editor, notification preferences.
- **LLM layer:** Coaching agent with structured message schema.
- **Agents (if any):** Single agent.
- **Tools / Integrations:** Push provider, email provider, optional wearables ingestion.
- **Memory / RAG:** Rolling summaries; optional encrypted journal retrieval.
- **Data sources:** First-party events, user goals, consent flags.

---

### 4. Data Flow

1. **Input:** Record event with `user_id`, `habit_id`, timestamp, optional context tags.
2. **Processing:** Aggregate windows; decide if coaching message should be generated (rate limits).
3. **Tool usage:** Pull stats; propose reminder time; validate against quiet hours policy.
4. **Output:** Deliver notification; store message id for feedback thumbs.

---

### 5. Agent Interaction (if applicable)

Single agent. Moderation can be a **deterministic ruleset + classifier** before send.

---

### 6. Scaling Considerations

- **Horizontal scaling:** Partition ingestion by user shard; scale workers with queue depth.
- **Caching:** Precomputed weekly aggregates for fast reads.
- **Async processing:** All coaching generation async; never block check-in API.

---

### 7. Failure Handling

- **Retries:** Notification retries with exponential backoff; dead-letter after N tries.
- **Fallbacks:** Skip coaching generation if policy engine marks user in “quiet period.”
- **Validation:** Reject events with impossible timestamps; cap payload sizes.

---

### 8. Observability

- **Logging:** Generation reasons, policy decisions, delivery receipts (metadata).
- **Tracing:** Trace agent + provider sends with `user_id` baggage internally.
- **Metrics:** DAU/WAU, notification CTR, opt-out spikes, moderation blocks.
