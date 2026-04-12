### 1. System Overview
**Supervisor** expands a task tree. **Retriever agents** populate **evidence cards** with URLs + excerpts. **Critic** rejects weak cards. **Writer** composes final artifact with mandatory citations.

### 2. Architecture Diagram (text-based)
```
Question → planner → retriever agents (parallel)
                ↓
         critic → writer → cited brief
```

### 3. Core Components
Fetch sandbox, cache of normalized pages, citation parser, budget controller, export renderer, moderation filters

### 4. Data Flow
Plan step → tool batch → store raw + cleaned text → score relevance → either keep or discard → iterate until stop condition

### 5. Agent Interaction
Structured message bus; critic cannot edit writer memory directly; each claim maps to card IDs

### 6. Scaling Challenges
Fan-out queries; duplicate pages; long PDFs need chunking; rate limits on search APIs

### 7. Failure Handling
Tool failure → annotate uncertainty; max steps exceeded → partial brief with explicit TODOs

### 8. Observability Considerations
Steps per task, token usage per role, citation validation pass rate, blocked domain attempts, human override reasons
