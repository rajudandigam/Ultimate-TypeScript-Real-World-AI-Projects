### 1. System Overview
**ELN connector** posts goals. **Cheminformatics services** expose reaction transforms. **Safety service** is sidecar with higher trust than LLM. **Agent** orchestrates calls and builds a **versioned synthesis DAG**.

### 2. Architecture Diagram (text-based)
```
Target + constraints → synthesis agent → search / inventory tools
                         ↓
              safety service → ELN artifact (signed)
```

### 3. Core Components
Molecule normalizer, solvent library, hazard classifier, inventory reservation (soft lock), PDF export of plan, PI approval workflow

### 4. Data Flow
Parse target SMILES → propose disconnections → verify each step against inventory + hazards → rank by step count and cost proxies → serialize DAG → await approval

### 5. Agent Interaction
Agent cannot mark a step “safe” if safety service returns block; LLM text cannot override red flags

### 6. Scaling Strategy
Cache reaction subgraphs; parallelize independent branches; queue heavy conformer searches to HPC pool

### 7. Failure Modes
Ambiguous stereochemistry; missing experimental conditions in RAG; tool timeouts mid-plan—checkpoint partial DAG, require human continuation

### 8. Observability Considerations
Tool latency, safety block rate, plan acceptance rate, IP access denials, model version per org
