### 1. System Overview
**Sidecar or central gateway** terminates HTTP from apps. **Workflow** applies ordered transforms: decode → classify → rewrite → sign request → forward.

### 2. Architecture Diagram (text-based)
```
Client → gateway workflow → redactors → LLM vendor
                    ↓
            audit hashes + policy id
```

### 3. Core Components
Policy store with semver, span classifier pool, token vault, admin UI for overrides, chaos tests for partial body failures

### 4. Data Flow
Parse content-type → walk JSON/protobuf → emit spans → apply transforms (mask/hash/tokenize) → re-serialize → validate schema still parses → forward

### 5. Agent Interaction
None in prod hot path; staging assistant may propose policy diffs from diff reports

### 6. Scaling Strategy
Stateless horizontal scale; batch small payloads; streaming requires line-buffer discipline; isolate per-tenant CPU budgets

### 7. Failure Modes
Invalid JSON after transform → reject request with diagnostic code; classifier timeout → fail closed for finance tier, fail open for dev tier per policy

### 8. Observability Considerations
Redaction counts by field type, latency added, policy version per request, blocked leak attempts, override audit trail
