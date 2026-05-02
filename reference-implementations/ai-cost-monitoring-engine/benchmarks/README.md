# Benchmarks (local)

`cost-benchmark.ts` measures how long a single in-memory aggregation pass takes over **50,000** synthetic `EnrichedUsageEvent` rows.

## Run

From `reference-implementations/ai-cost-monitoring-engine/`:

```bash
pnpm benchmark
```

## Interpreting output

- Results are **machine-dependent** (CPU, thermal limits, Node version).
- The benchmark answers: “Is aggregation fast enough for a dev laptop on a modest batch?” — not “What will production latency be under multi-tenant load.”
- This repo does **not** publish comparative “wins” or savings claims from these numbers.
