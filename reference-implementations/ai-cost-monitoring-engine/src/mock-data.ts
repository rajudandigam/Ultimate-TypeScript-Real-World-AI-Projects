import type { PricingConfig } from "@repo/governance";
import type { UsageEvent } from "./types.js";

const DAY_MS = 86_400_000;
/** Fixed anchor so local runs and tests see stable calendar buckets. */
const BASE_UTC_MS = Date.UTC(2026, 0, 1, 10, 0, 0);

function at(dayOffset: number, hour = 0): number {
  return BASE_UTC_MS + dayOffset * DAY_MS + hour * 3_600_000;
}

/** Demo pricing only — replace with your provider list for real workloads. */
export function demoPricing(): PricingConfig {
  return {
    models: {
      "demo-fast": { promptPerMillion: 1.0, completionPerMillion: 2.0 },
      "demo-large": { promptPerMillion: 5.0, completionPerMillion: 15.0 },
    },
    fallback: { promptPerMillion: 3.0, completionPerMillion: 6.0 },
  };
}

/**
 * Synthetic multi-day workload: steady traffic, one high-cost day, a few
 * slow calls, and a completion-token spike — all without external APIs.
 */
export function mockUsageEvents(): UsageEvent[] {
  const events: UsageEvent[] = [];

  const push = (e: Omit<UsageEvent, "metadata"> & { metadata?: UsageEvent["metadata"] }) =>
    events.push(e);

  for (let d = 0; d < 3; d++) {
    for (let i = 0; i < 4; i++) {
      push({
        runId: `run-${d}-${i}`,
        projectId: "proj-demo",
        model: "demo-fast",
        inputTokens: 1_200 + i * 50,
        outputTokens: 400 + i * 20,
        latencyMs: 400 + i * 30,
        timestamp: at(d, 8 + i),
      });
    }
  }

  // Spike day: many more completion tokens on demo-large
  for (let i = 0; i < 6; i++) {
    push({
      runId: `run-spike-${i}`,
      projectId: "proj-demo",
      model: "demo-large",
      inputTokens: 8_000,
      outputTokens: 18_000 + i * 2_000,
      latencyMs: 900 + i * 40,
      // Keep spike hours on the same UTC calendar day so day-level rollups match intuition.
      timestamp: at(3, 6 + i),
    });
  }

  // Latency tail for anomaly detector
  push({
    runId: "run-slow-1",
    projectId: "proj-demo",
    model: "demo-fast",
    inputTokens: 2_000,
    outputTokens: 500,
    latencyMs: 12_000,
    timestamp: at(3, 5),
    metadata: { route: "/chat" },
  });

  // Second project for isolation checks
  push({
    runId: "run-other",
    projectId: "proj-internal-tools",
    model: "demo-fast",
    inputTokens: 3_000,
    outputTokens: 900,
    latencyMs: 650,
    timestamp: at(2, 15),
  });

  return events;
}
