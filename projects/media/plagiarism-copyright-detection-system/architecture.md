### 1. System Overview
**Ingest bus** receives content. **Fingerprint worker** writes shingles/hashes. **Matcher** queries index + external APIs. **Case workflow** tracks status from **open → confirmed → resolved**.

### 2. Architecture Diagram (text-based)
```
Content → fingerprint → match scores
        ↓
Threshold → case queue → human/legal → outcome
```

### 3. Core Components
Object storage, search index, licensed API connectors, case DB, reviewer UI, webhook notifications

### 4. Data Flow
Normalize unicode → chunk → embed/hash → top-k retrieval → rule score fusion → attach evidence packet

### 5. Agent Interaction
Optional LLM for reviewer summary only; detector remains deterministic/ML hybrid outside LLM

### 6. Scaling Considerations
Bloom filters for cheap negatives; shard index by tenant; async for bulk imports

### 7. Failure Handling
API outage → mark inconclusive; never auto-delete user content without policy path

### 8. Observability
Match latency distribution, appeal outcomes, index freshness, API quota usage
