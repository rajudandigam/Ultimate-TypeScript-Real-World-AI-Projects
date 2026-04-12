### 1. System Overview
**Framework definitions** drive **check packs**. **Collector workflows** write **evidence objects** to a vault. **Gap analyzer** compares expected vs observed; **exporter** renders auditor bundles.

### 2. Architecture Diagram (text-based)
```
Schedulers → collectors → evidence vault
                 ↓
         mapper → gaps → tickets → export
```

### 3. Core Components
Control graph DB, connector SDK, credential broker, workflow engine, UI for exceptions, PDF/zip exporter

### 4. Data Flow
Select scope (accounts, systems) → run checks in parallel → normalize results → attach to control nodes → compute pass/fail → notify owners

### 5. Agent Interaction
Optional mapping assistant proposes control links; humans approve; runtime checks never trust LLM output as evidence

### 6. Scaling Challenges
Thousands of accounts; API throttling; long-running evidence (e.g., log pulls) need pagination and resumability

### 7. Failure Handling
Collector failure → partial report with explicit unknowns; never silently mark pass

### 8. Observability Considerations
Check duration, failure taxonomy, evidence age histograms, connector error rates, drift between scheduled vs on-demand runs
