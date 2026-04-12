### 1. System Overview
**Rules registry** is deployed like code with semver. **Session store** holds minimal answers. **Agent** is stateless per request with session id.

### 2. Architecture Diagram (text-based)
```
User answers → parser → rules engine → outcome JSON
                         ↓
                 explainer agent → UI + audit event
```

### 3. Core Components
CMS for official URLs, PDF form filler (optional), language packs, fraud/abuse rate limiter, admin diff viewer for rule updates

### 4. Data Flow
Collect answers → validate completeness → execute rules DAG → attach citations → render checklist → optionally prefill PDF fields locally in browser

### 5. Agent Interaction
Parser cannot widen income buckets; explainer cannot contradict engine JSON; escalation tool opens human case

### 6. Scaling Strategy
Horizontal BFF pods; edge cache static assets; burst traffic during policy announcements—queue explainer if needed

### 7. Failure Modes
Ambiguous household definitions; stale CMS link; LLM proposes wrong document name—link checker nightly, kill switch for explainer

### 8. Observability Considerations
Outcome distribution, clarification turn count, escalation rate, rule version per session, accessibility audit metrics
