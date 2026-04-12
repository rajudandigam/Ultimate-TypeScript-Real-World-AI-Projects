### 1. System Overview
**Script store** versions inputs. **Scene graph DB** links characters, locations, props. **Render queue** prioritizes scenes by shooting schedule import (optional).

### 2. Architecture Diagram (text-based)
```
Script → parse → scene graph → shot planner → board specs
                              ↓
                     render/QC → export bundles
```

### 3. Core Components
Style bible registry, render worker pool, continuity linter, rights metadata on references, watermarking for previews

### 4. Data Flow
Upload → validate format → build graph → plan shots per scene → generate images async → run QC rules → package ZIP/PDF for review → iterate on comments

### 5. Agent Interaction
LLM nodes consume only scene subgraph slices; cannot widen location without producer flag

### 6. Scaling Considerations
Long features = thousands of shots: batch render overnight; cache prompts; parallelize by scene; GPU quota per production

### 7. Failure Modes
Parser divergence on custom macros; OOM on hi-res frames—sandboxed render limits, fallback to line sketches

### 8. Observability Considerations
Queue depth, render minutes per scene, QC rejection taxonomy, cost per minute of finished boards, iteration count per scene
