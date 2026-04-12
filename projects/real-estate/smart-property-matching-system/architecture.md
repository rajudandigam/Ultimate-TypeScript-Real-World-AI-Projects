### 1. System Overview
**Profile service** stores prefs + consent. **Matcher Agent** runs **search + rerank** tools. **Compliance layer** strips illegal filters. **CRM sync** logs recommended listings with evidence payload.

### 2. Architecture Diagram (text-based)
```
Buyer prefs → Matcher Agent → listing index + maps
        ↓
Ranked matches + rationales → client UI / CRM
```

### 3. Core Components
Search API, vector DB, rules engine, map isochrone worker, audit log, broker dashboard

### 4. Data Flow
Ingest prefs → validate → query → rerank with diversity/novelty caps → explain → track engagement feedback

### 5. Agent Interaction
Single agent per session; broker can pin/unpin constraints manually

### 6. Scaling Considerations
Index per market; cache isochrones; precompute hot neighborhoods

### 7. Failure Handling
Zero results → relax soft constraints with explicit user confirm; map API fail → distance proxy only

### 8. Observability
Match acceptance, blocked filter attempts, search latency, vendor error rates
