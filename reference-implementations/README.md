# Reference implementations

This folder is reserved for **flagship, runnable implementations** that exercise shared packages (`@repo/core`, `@repo/governance`, `@repo/evals`) without replacing the blueprint catalog under `projects/`.

## Implementations

| Folder | Catalog alignment | Notes |
|--------|-------------------|--------|
| [`ai-cost-monitoring-engine/`](ai-cost-monitoring-engine/) | [`projects/devtools/ai-cost-monitoring-engine`](../projects/devtools/ai-cost-monitoring-engine/) | Runnable slice: ingest → rollups → anomalies → budget hints → reports |
| [`multi-agent-incident-response/`](multi-agent-incident-response/) | [`projects/devops/multi-agent-incident-response-system`](../projects/devops/multi-agent-incident-response-system/) | **Planning:** [`IMPLEMENTATION_PLAN.md`](multi-agent-incident-response/IMPLEMENTATION_PLAN.md) — second flagship (not runnable yet) |

See [`docs/PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md`](../docs/PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md).
