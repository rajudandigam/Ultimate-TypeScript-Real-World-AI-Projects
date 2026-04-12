### 1. System Overview
**Asset catalog** stores lat/lon, criticality, and dependencies. **Hazard cache** stores versioned raster/tile references. **Run service** materializes scenario outputs per run id.

### 2. Architecture Diagram (text-based)
```
Assets → scenario agent → hazard / flood tools
                  ↓
         exposure metrics → reports + APIs
```

### 3. Core Components
STAC catalog client, raster compute workers (COG clipping), assumption registry, export templates (TCFD-style sections), access control by business unit

### 4. Data Flow
Select scenario pack → fetch hazard tiles for bbox → join assets → compute per-asset metrics → roll up to portfolio → cache results keyed by scenario version

### 5. Agent Interaction
Agent cannot alter hazard source pixels; only reads summaries produced by geo tools

### 6. Scaling Strategy
Tile caching CDN; parallelize per region; precompute common portfolios nightly; GPU optional for heavy raster ops

### 7. Failure Modes
Tile API outage; CRS mismatch; partial asset geocodes—degraded mode with explicit coverage gaps in report

### 8. Observability Considerations
Tile fetch latency, acres processed/sec, cache hit rate, rerun frequency when hazard data versions bump
