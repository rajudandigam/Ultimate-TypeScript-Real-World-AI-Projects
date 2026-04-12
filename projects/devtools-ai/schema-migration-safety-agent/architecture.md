### 1. System Overview
**CI plugin** posts migration artifacts to **analysis service**. **Shadow Postgres** spins from migration chain + seed subset. **Policy registry** stores org-specific banned ops.

### 2. Architecture Diagram (text-based)
```
PR → migration diff → static analysis + usage index
                ↓
        safety agent → report → pass/fail check
```

### 3. Core Components
Ephemeral DB provisioner, EXPLAIN sandbox, ts-morph worker pool, suppression annotation parser, audit log of overrides

### 4. Data Flow
Collect migrations since base → apply to shadow → run EXPLAIN for DDL → diff AST → join usage index → aggregate severities → post PR comment

### 5. Agent Interaction
Agent cannot approve its own PR; fail/warn thresholds configured per repo tier

### 6. Scaling Considerations
Large monorepos: incremental symbol index cache; parallelize per service package; cap shadow DB apply time with timeout tiers

### 7. Failure Modes
Migration order conflicts across branches; flaky shadow DB startup—retry with clean volume, merge-queue awareness

### 8. Observability Considerations
Check runtime p95, false positive/negative tags from postmortems, EXPLAIN cardinality warnings, override frequency by team
