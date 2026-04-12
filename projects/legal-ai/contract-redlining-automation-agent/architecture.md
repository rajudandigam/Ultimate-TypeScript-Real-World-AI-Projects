### 1. System Overview
**Document service** stores immutable originals. **Playbook registry** versions JSON rules + clause library text. **Workflow** routes by contract type and amount thresholds.

### 2. Architecture Diagram (text-based)
```
Contract → segment/classify → redlining agent → suggested diff
                      ↓
              counsel approve → export → CLM
```

### 3. Core Components
OOXML diff engine, OCR for scanned PDFs (optional path), RBAC (counsel vs buyer), watermarking, audit export for regulators

### 4. Data Flow
Parse doc → build clause graph → evaluate rules in topological order → produce edit operations list → render preview → on approve materialize DOCX/PDF

### 5. Agent Interaction
Agent cannot email counterparty; export only; dual control for high-value thresholds

### 6. Scaling Considerations
Large M&A docs: stream parse; chunk RAG; async jobs for >200 pages; dedupe repeated definitions

### 7. Failure Modes
Broken OOXML after edit; conflicting track changes—validate with Word roundtrip test in CI, repair pass

### 8. Observability Considerations
Time-to-first draft, human edit distance, playbook hit coverage, export failures, privilege tagging errors (must be 0)
