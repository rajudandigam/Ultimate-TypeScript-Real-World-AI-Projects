### 1. System Overview
**Event record** stores constraints. **Agent** orchestrates tools; **validator** recomputes portions server-side before persisting “locked quantities.”

### 2. Architecture Diagram (text-based)
```
Form → catering agent → portion tool / vendor search
                  ↓
           brief artifact → storage → reminders
```

### 3. Core Components
Rules engine (YAML/DB), artifact store (S3), PDF renderer, email templater, RBAC for co-hosts, audit log

### 4. Data Flow
Normalize headcount segments → compute portions → check dietary coverage gaps → if gap, agent proposes add-on dishes → vendor shortlist → export

### 5. Agent Interaction
Single agent; parallel read tools; write tools only create drafts until host confirms

### 6. Scaling Considerations
Many concurrent weekend events; cache vendor search polygons; prewarm common menu templates

### 7. Failure Scenarios
Vendor API empty → widen radius with user consent; math tool mismatch → block save; LLM adds non-catering item → schema filter

### 8. Observability Considerations
Time-to-brief, portion recalculation diffs, vendor tool error rate, export downloads, host correction frequency
