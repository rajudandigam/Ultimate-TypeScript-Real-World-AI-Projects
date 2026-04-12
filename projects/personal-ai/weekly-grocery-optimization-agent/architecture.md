### 1. System Overview
**Pantry service** stores items with qty and expiry confidence. **Agent** emits **meal plan + grocery list** artifacts versioned per week. **Merge service** dedupes and applies hard dietary blocks.

### 2. Architecture Diagram (text-based)
```
Inputs → pantry store → grocery agent → list artifact
                              ↓
                    store adapters / share export
```

### 3. Core Components
OCR pipeline (async), recipe DB, offer ingestor, optimizer (MILP-lite or heuristics in TS), notification scheduler, household RBAC

### 4. Data Flow
Snapshot pantry → propose meals → expand to ingredients → subtract on-hand → rank optional add-ons by deals → export

### 5. Agent Interaction
Tool calls return structured rows; agent cannot invent SKUs; final list diff-reviewed by optional second “safety checker” prompt for allergens only

### 6. Scaling Considerations
Many households per account; heavy OCR offloaded to queue; cache store flyers by ZIP; compress repeated staples

### 7. Failure Scenarios
Offer feed stale → label prices unverified; vision wrong item → user correction loop updates embeddings; optimizer infeasible → relax one soft goal with explanation

### 8. Observability Considerations
OCR correction rate, deal attach precision, weekly job success, cart deep link click-through, $ estimate error distribution
