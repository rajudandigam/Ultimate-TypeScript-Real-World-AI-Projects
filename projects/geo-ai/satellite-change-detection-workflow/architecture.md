### 1. System Overview
**AOI registry** stores geometries, cadence, and sensor mix. **Artifact store** holds COG mosaics per date. **Workflow orchestrator** tracks lineage from source scene IDs to alerts.

### 2. Architecture Diagram (text-based)
```
STAC → preprocess → align → change → polygons
                         ↓
                   alerts → GIS / SIEM / email
```

### 3. Core Components
GPU/CPU worker autoscaling, nodata handling, CRS normalization, label tool integration, RBAC for sensitive AOIs

### 4. Data Flow
Schedule AOI → pull intersecting scenes → build composited reference & target → compute change raster → threshold → polygonize → attach metadata → notify if area > min threshold

### 5. Agent Interaction
LLM captioning off hot path; async only after polygon lock

### 6. Scaling Strategy
Tile-based parallelism; pyramid reads; spot instances for batch; separate hot path for high-cadence small AOIs

### 7. Failure Modes
Provider outage mid-mosaic; orbit gaps; snow unmasked—partial run markers, manual override to last good composite

### 8. Observability Considerations
Scene fetch success, coreg RMSE distribution, polygon count per run, alert latency, storage growth per AOI
