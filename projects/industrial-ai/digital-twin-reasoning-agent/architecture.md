### 1. System Overview
**Twin service** exposes versioned snapshots. **Agent BFF** mediates tool calls with quotas. **Result store** keeps run artifacts for diff and compliance.

### 2. Architecture Diagram (text-based)
```
Question → twin agent → DES / analytics tools
                ↓
        KPI diff + citations → UI / change request draft
```

### 3. Core Components
Scenario registry, parameter validator, cost model plugin, PDF ingestion pipeline, diff viewer vs baseline snapshot

### 4. Data Flow
Resolve twin version → bind parameters within allowed ranges → execute N replications if stochastic → aggregate stats → attach SOP citations → return structured answer

### 5. Agent Interaction
Write paths to MES are disabled by default; “propose patch” returns JSON only for human-approved merge jobs

### 6. Scaling Strategy
Queue long runs on GPU/CPU worker pools; cache identical parameter hashes; parallelize independent scenarios

### 7. Failure Modes
Simulator timeout partial results; inconsistent units (imperial/metric); RAG retrieves wrong SOP revision—unit normalization layer, version pinning on docs

### 8. Observability Considerations
p95 simulation latency, tool error rate, twin version drift alarms, $/scenario, repeat question detection
