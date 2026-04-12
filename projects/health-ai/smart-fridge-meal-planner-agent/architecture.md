### 1. System Overview
**Inventory graph** nodes are SKUs with qty and expiry distributions. **Scan pipeline** writes provisional nodes pending user confirm. **Agent** reads graph snapshot id.

### 2. Architecture Diagram (text-based)
```
Scan → inventory graph → meal agent → recipe tools
                  ↓
           meal plan + gap list → notifications
```

### 3. Core Components
On-device model bundle server, cloud fallback queue, recipe CMS with licensing, nutrition calculator service, audit of vision images deleted after N days

### 4. Data Flow
Capture image → classify items → user corrects → lock inventory → propose meals consuming expiring nodes → compute shortfall → optional e-commerce handoff (policy gated)

### 5. Agent Interaction
Recipes must come from tool-backed IDs; substitutions require explicit user allergen profile re-check

### 6. Scaling Strategy
Per-household sharding; compress recipe text to embeddings for retrieval; rate limit camera uploads; burst compute on Sunday planning peaks

### 7. Failure Modes
Fridge door open ruins scan lighting; duplicate adds from two users—multiplayer merge rules, lighting tips UX

### 8. Observability Considerations
Vision accuracy by category, plan churn, waste proxy trends, cloud vs on-device inference ratio, user correction burden
