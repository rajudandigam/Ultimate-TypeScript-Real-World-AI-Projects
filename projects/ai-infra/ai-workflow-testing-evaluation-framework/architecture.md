### 1. System Overview
**Fixture store** holds inputs + expected constraints (schema, embeddings distance bounds). **Runner** executes workflow versions in isolation. **Comparator** scores diffs and opens PR comments.

### 2. Architecture Diagram (text-based)
```
Fixtures → runner workflow → workflow under test
                 ↓
         asserts → report → CI gate
```

### 3. Core Components
Mock tool gateway, trace store, diff visualizer, scheduler for canaries, secrets injector for ephemeral creds

### 4. Data Flow
Select fixture set → compile workflow version → execute with deterministic seeds where possible → collect spans/metrics → aggregate pass/fail matrix

### 5. Agent Interaction
Workflows may include agents; tests treat agent steps as black boxes with **bounded** probabilistic assertions (e.g., score distributions)

### 6. Scaling Challenges
Parallel matrix across hundreds of graphs; artifact storage growth; long-running canaries

### 7. Failure Handling
Tool mock mismatch → fail with actionable diff; infra flake → retry with capped attempts

### 8. Observability Considerations
Per-node latency deltas, token/cost deltas version-to-version, schema violation trends, fixture staleness alerts
