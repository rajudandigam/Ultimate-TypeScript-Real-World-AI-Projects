/**
 * Cost monitoring suite — exercises the AI Cost Monitoring reference slice
 * using the shared harness (local timings only).
 */
import { performance } from "node:perf_hooks";
import { cpus, release, totalmem } from "node:os";
import process from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { aggregateCosts } from "@ref/ai-cost-monitoring-engine/cost-aggregator";
import { detectAnomalies } from "@ref/ai-cost-monitoring-engine/anomaly-detector";
import { UsageEventStore } from "@ref/ai-cost-monitoring-engine/ingest-usage-event";
import { demoPricing, mockUsageEvents } from "@ref/ai-cost-monitoring-engine/mock-data";
import type { EnrichedUsageEvent } from "@ref/ai-cost-monitoring-engine/types";
import { runBenchmark } from "../../src/benchmark-runner.js";
import {
  writeJsonResults,
  writeMarkdownSummary,
  type HarnessRunDocument,
} from "../../src/result-writer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/**
 * Replays scaled mock usage through ingest to produce enriched events
 * (same shapes the reference demo uses).
 */
function buildEnrichedEvents(scale: number): {
  events: EnrichedUsageEvent[];
  buildMs: number;
} {
  const t0 = performance.now();
  const pricing = demoPricing();
  const store = new UsageEventStore();
  const base = mockUsageEvents();
  for (let s = 0; s < scale; s++) {
    for (const e of base) {
      store.ingest(pricing, {
        ...e,
        runId: `${e.runId}~${s}`,
      });
    }
  }
  const t1 = performance.now();
  return { events: [...store.all()], buildMs: t1 - t0 };
}

async function main(): Promise<void> {
  const iterations = envInt("BENCHMARK_ITERATIONS", 25);
  const scale = envInt("COST_MONITORING_EVENT_SCALE", 200);

  const { events, buildMs } = buildEnrichedEvents(scale);
  const rollups = aggregateCosts(events);

  const agg = await runBenchmark(
    "aggregateCosts",
    () => {
      aggregateCosts(events);
    },
    { iterations },
  );

  const anom = await runBenchmark(
    "detectAnomalies",
    () => {
      detectAnomalies(events, rollups);
    },
    { iterations },
  );

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outJson = path.join(__dirname, "../../results", `cost-monitoring-${stamp}.json`);
  const outMd = path.join(__dirname, "../../results", `cost-monitoring-${stamp}.md`);

  const disclaimer =
    "Local reference benchmark only. Numbers are not comparable across machines without controlled reproduction. Do not treat as a product SLA, vendor superiority claim, or financial outcome.";

  const doc: HarnessRunDocument = {
    suite: "cost-monitoring",
    generatedAtIso: new Date().toISOString(),
    disclaimer,
    environment: {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      cpus: cpus().length,
      totalMemBytes: totalmem(),
      osRelease: release(),
      benchmarkIterations: iterations,
      costMonitoringEventScale: scale,
    },
    scenarios: [
      {
        name: "dataset_build (ingest + cost enrich)",
        meta: {
          eventsProcessed: events.length,
          buildMs,
          note: "One-off setup cost before timed loops; not repeated per iteration.",
        },
        result: {
          name: "dataset_build",
          runs: [
            {
              iteration: 0,
              durationMs: buildMs,
              success: true,
            },
          ],
          stats: {
            iterations: 1,
            successCount: 1,
            failureCount: 0,
            sampleCount: 1,
            minMs: buildMs,
            maxMs: buildMs,
            avgMs: buildMs,
            p50Ms: buildMs,
            p95Ms: buildMs,
            stdDevMs: 0,
          },
        },
      },
      {
        name: "aggregateCosts (hot path)",
        meta: { eventsProcessed: events.length },
        result: agg,
      },
      {
        name: "detectAnomalies (hot path)",
        meta: {
          eventsProcessed: events.length,
          note: "Uses rollups computed once before the loop (stable detector input).",
        },
        result: anom,
      },
    ],
  };

  writeJsonResults(outJson, doc);
  writeMarkdownSummary(outMd, doc);

  process.stderr.write(
    `[benchmarks] wrote:\n  ${outJson}\n  ${outMd}\n`,
  );
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
