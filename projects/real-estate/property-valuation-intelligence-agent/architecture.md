### 1. System Overview
**Valuation Agent** calls **comp search**, **feature fetch**, and **macro series** tools. **Deterministic pricing core** computes range. **Narrative layer** attaches drivers with citations. **Report builder** exports artifacts with versioning.

### 2. Architecture Diagram (text-based)
```
Address/parcel → Agent → data vendors
        ↓
Valuation engine + narrative → report store
```

### 3. Core Components
API gateway, vendor adapters, geospatial index, model registry, PDF renderer, audit DB

### 4. Data Flow
Normalize property → pull comps within radius/time rules → adjust features → compute range → explain → store `report_id`

### 5. Agent Interaction
Single agent; numeric truth from engine/tools, not free-form numbers

### 6. Scaling Considerations
Cache comps by MLS snapshot id; shard by MSA; async PDF for bulk portfolios

### 7. Failure Handling
Missing fields → explicit widened confidence; vendor outage → degrade with banner

### 8. Observability
Vendor latency, comp count distributions, human override reasons, drift monitors
