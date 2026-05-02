/**
 * Micro-benchmark for pure aggregation throughput on synthetic events.
 * Wall time varies by CPU and Node version — use this only as a local sanity check.
 */
import { performance } from "node:perf_hooks";
import { aggregateCosts } from "../src/cost-aggregator.js";
import type { EnrichedUsageEvent } from "../src/types.js";

const N = 50_000;

function synth(): EnrichedUsageEvent[] {
  const out: EnrichedUsageEvent[] = [];
  const dayBase = Date.UTC(2026, 2, 1);
  for (let i = 0; i < N; i++) {
    out.push({
      runId: `run-${i % 200}`,
      projectId: `proj-${i % 20}`,
      model: i % 2 === 0 ? "demo-fast" : "demo-large",
      inputTokens: 500 + (i % 50),
      outputTokens: 300 + (i % 80),
      latencyMs: 200 + (i % 400),
      timestamp: dayBase + (i % 5) * 86_400_000,
      eventId: `evt_${i}`,
      costEstimate: {
        model: i % 2 === 0 ? "demo-fast" : "demo-large",
        currency: "USD",
        promptCost: 0.00001,
        completionCost: 0.00002,
        total: 0.00003,
      },
    });
  }
  return out;
}

const events = synth();
const t0 = performance.now();
aggregateCosts(events);
const t1 = performance.now();

console.log(
  JSON.stringify(
    {
      events: N,
      aggregateMs: Number((t1 - t0).toFixed(3)),
      note:
        "This reports elapsed time for one in-process aggregation pass; it is not a performance SLA.",
    },
    null,
    2,
  ),
);
