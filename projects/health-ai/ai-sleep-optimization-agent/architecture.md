### 1. System Overview
**Integrations** pull nightly summaries (not raw high-frequency PII by default). **Planner** stores weekly habit contracts. **Notification service** sends nudges with quiet hours respect.

### 2. Architecture Diagram (text-based)
```
Wearables → aggregate → sleep agent → plan JSON
                    ↓
            reminders + in-app review
```

### 3. Core Components
OAuth token vault, consent registry, content moderation for journal text, offline-first mobile cache

### 4. Data Flow
Ingest sleep summary → detect trends (latency, fragmentation) → propose changes → user edits → persist versioned plan → evaluate next week

### 5. Agent Interaction
Agent reads aggregates only; journaling free text passes through safety classifier before model

### 6. Scaling Strategy
Batch nightly jobs per timezone; compress historical nights to features; rate limit vendor APIs

### 7. Failure Modes
Missing nights after travel; duplicate devices double-counting—merge rules, explicit unknowns in copy

### 8. Observability Considerations
Sync failure rate, plan acceptance, reminder CTR, safety filter triggers, retention cohort curves
