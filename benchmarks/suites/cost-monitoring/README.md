# Suite: cost-monitoring

Runs the shared harness against the **AI Cost Monitoring** reference implementation (`@ref/ai-cost-monitoring-engine`): synthetic usage is ingested and enriched, then **aggregation** and **anomaly detection** are timed in hot loops.

## Run

From repository root:

```bash
pnpm install
cd benchmarks
pnpm suite:cost-monitoring
```

Optional environment variables:

| Variable | Default | Meaning |
|----------|---------|---------|
| `BENCHMARK_ITERATIONS` | `25` | Repeat count for each timed scenario |
| `COST_MONITORING_EVENT_SCALE` | `200` | Replays the mock catalog `scale` times (events ≈ `scale × mockUsageEvents().length`) |

## Outputs

Artifacts are written under `benchmarks/results/` (see `results/README.md`). Stderr prints the exact paths after each run.

## Notes

- This suite does **not** call external LLM APIs.
- Timings include only the JavaScript hot path shown in the scenario names; dataset build (ingest + cost enrich) is reported separately as a single-shot row.
