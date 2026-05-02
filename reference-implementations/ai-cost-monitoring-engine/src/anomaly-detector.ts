import type { CostRollups, EnrichedUsageEvent } from "./types.js";

export type AnomalyType = "cost_spike" | "high_latency" | "token_surge";

export interface AnomalyFinding {
  type: AnomalyType;
  severity: "low" | "medium" | "high";
  description: string;
  evidence: Record<string, unknown>;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid]! : (s[mid - 1]! + s[mid]!) / 2;
}

function dailyTotals(events: readonly EnrichedUsageEvent[]): Array<{
  day: string;
  cost: number;
}> {
  const m = new Map<string, number>();
  for (const e of events) {
    const day = new Date(e.timestamp).toISOString().slice(0, 10);
    m.set(day, (m.get(day) ?? 0) + e.costEstimate.total);
  }
  return [...m.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, cost]) => ({ day, cost }));
}

/**
 * Rule-based detector suitable for demos: compares the latest day to a short
 * prior baseline, flags tail latency vs cohort median, and token bursts per model.
 * Tune thresholds for your environment; this is not ML-based anomaly scoring.
 */
export function detectAnomalies(
  events: readonly EnrichedUsageEvent[],
  _rollups: CostRollups,
): AnomalyFinding[] {
  const findings: AnomalyFinding[] = [];
  if (events.length === 0) return findings;

  const series = dailyTotals(events);
  if (series.length >= 4) {
    const last = series[series.length - 1]!;
    const prior = series.slice(0, -1).slice(-3);
    const priorAvg =
      prior.reduce((s, d) => s + d.cost, 0) / Math.max(1, prior.length);
    if (priorAvg > 0 && last.cost > priorAvg * 2) {
      findings.push({
        type: "cost_spike",
        severity: last.cost > priorAvg * 3 ? "high" : "medium",
        description:
          "Latest UTC day cost is materially above the trailing 3-day average for this dataset.",
        evidence: {
          lastDay: last.day,
          lastDayCost: last.cost,
          priorWindowAvg: priorAvg,
          ratio: last.cost / priorAvg,
        },
      });
    }
  }

  const latencies = events.map((e) => e.latencyMs);
  const medLat = median(latencies);
  const latThreshold = Math.max(5000, medLat * 3);
  const hot = events.filter((e) => e.latencyMs >= latThreshold);
  if (hot.length > 0) {
    findings.push({
      type: "high_latency",
      severity: hot.length > 2 ? "medium" : "low",
      description:
        "One or more events exceed a latency threshold derived from the batch median.",
      evidence: {
        thresholdMs: latThreshold,
        medianLatencyMs: medLat,
        sampleEventIds: hot.slice(0, 5).map((e) => e.eventId),
        affectedProjectIds: [...new Set(hot.map((e) => e.projectId))],
      },
    });
  }

  const byModel = new Map<string, number[]>();
  for (const e of events) {
    const arr = byModel.get(e.model) ?? [];
    arr.push(e.outputTokens);
    byModel.set(e.model, arr);
  }
  for (const [model, outs] of byModel) {
    const medOut = median(outs);
    if (medOut <= 0) continue;
    const surge = events.filter(
      (e) => e.model === model && e.outputTokens > medOut * 5 && e.outputTokens > 800,
    );
    if (surge.length > 0) {
      findings.push({
        type: "token_surge",
        severity: "medium",
        description:
          "Completion-token volume for a model exceeds a multiple of the cohort median (possible prompt regression or tool loop).",
        evidence: {
          model,
          medianOutputTokens: medOut,
          flaggedEventIds: surge.map((e) => e.eventId),
        },
      });
    }
  }

  return findings;
}
