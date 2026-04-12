### 1. System Overview
**CMS** stores activities with metadata (skills, mess level, supervision). **Planner** outputs a **grid schema** the app renders as cards. **Controls** enforce max digital blocks and required outdoor minimums where configured.

### 2. Architecture Diagram (text-based)
```
Guardrails → planner agent → activity CMS tools
                    ↓
            week grid JSON → notifications + print view
```

### 3. Core Components
Parent admin UI, child profiles (no email), content review pipeline, analytics aggregates without child PII in logs

### 4. Data Flow
Load policy → query candidates → diversify tags → fill slots → validate constraints → publish week version → allow swaps that preserve constraints

### 5. Agent Interaction
Swap tool must verify replacement meets same duration band and skill tag coverage; agent cannot bypass parent max screen setting

### 6. Scaling Considerations
Curated library growth needs search index; burst usage Sunday nights; cache weekly templates by archetype

### 7. Failure Scenarios
Not enough activities for constraints → ask parent to relax one knob; CMS outage → serve last-good cached week; toxic user prompt → moderation filter

### 8. Observability Considerations
Swap frequency, constraint violation attempts, curator backlog size, parent thumbs down reasons
