### 1. System Overview
**Monorepo** hosts `legacy/`, `generated/`, and `tests/`. **CI** runs parser, graph checks, and parity suites on every PR. **Artifact store** keeps COBOL snapshots immutable.

### 2. Architecture Diagram (text-based)
```
COBOL + copybooks → parser → symbol graph → slice plan
                              ↓
            codegen agent → TS modules → tests → PR
```

### 3. Core Components
Parser service, graph DB, golden dataset vault, shadow execution harness (containerized mainframe stub), policy engine (PII fields never in prompts)

### 4. Data Flow
Import version tag → parse all units → resolve copybooks → build call graph → identify IO seams → generate adapter interfaces → emit TS → compile → run property tests → attach diff report

### 5. Agent Interaction
Agent writes only to `generated/` branch folders; human merges; no network deploy tools without break-glass role

### 6. Scaling Considerations
Millions of LOC: incremental parse cache by file hash; parallelize slices; cap LLM context with summarized graph neighborhoods only

### 7. Failure Modes
Parser ambiguity on dialect extensions; graph cycles in PERFORM graph—manual annotation files, fail CI until resolved

### 8. Observability Considerations
Parse error taxonomy, codegen token usage, test failure heatmap, human review hours per KLOC, regression rate post-release
