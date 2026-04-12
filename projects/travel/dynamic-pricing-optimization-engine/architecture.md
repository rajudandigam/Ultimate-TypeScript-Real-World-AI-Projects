### 1. System Overview
**Batch/feature pipeline** prepares signals. **Online path** serves **search parity** checks. **Pricing Agent** consumes a **bounded context** (last N days, segment, channel) and returns **structured price actions**.

### 2. Architecture Diagram (text-based)
```
Bookings/searches → features → pricing agent → policy engine
                              ↓
                    CRS/PMS adapters → audit + metrics
```

### 3. Core Components
Feature store, comp data ingestor, rules engine, simulation sandbox, approval service, channel manager connectors, monitoring dashboards

### 4. Data Flow
Trigger (schedule or demand spike) → assemble cohort features → agent proposes JSON actions → validate invariants (min rate, LOS) → queue for approval or auto-apply per tier

### 5. Agent Interaction
Tools: `get_forecast`, `get_comp_median`, `simulate_revenue`; agent cannot bypass policy engine output

### 6. Scaling Challenges
High-cardinality room types; global multi-property fan-out; API rate limits on CRS; cold-start new properties

### 7. Failure Handling
Partial comp data → widen confidence and require human sign-off; CRS timeout → retry with exponential backoff; never publish negative rates

### 8. Observability Considerations
Push success rate, latency to first recommendation, drift between suggested vs published prices, revenue guardrails breaches, per-channel parity alerts
