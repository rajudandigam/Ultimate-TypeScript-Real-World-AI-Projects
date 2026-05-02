import type { AnomalyFinding } from "./anomaly-detector.js";
import type { CostRollups, EnrichedUsageEvent } from "./types.js";

export interface BudgetPolicy {
  projectId: string;
  /** Soft threshold: emit warn / throttle recommendation. */
  softLimitUsd: number;
  /** Hard threshold: emit block recommendation (human approval still assumed). */
  hardLimitUsd: number;
  /** Advisory latency threshold for combined reporting. */
  latencyWarnMs: number;
}

export type BudgetAction =
  | "none"
  | "warn"
  | "recommend_throttle"
  | "recommend_block";

export interface BudgetFinding {
  projectId: string;
  action: BudgetAction;
  reason: string;
}

function projectSpend(rollups: CostRollups, projectId: string): number {
  return rollups.byProject.get(projectId) ?? 0;
}

function hasLatencyAnomalyForProject(
  anomalies: readonly AnomalyFinding[],
  projectId: string,
): boolean {
  return anomalies.some((a) => {
    if (a.type !== "high_latency") return false;
    const ids = a.evidence["affectedProjectIds"];
    return Array.isArray(ids) && ids.includes(projectId);
  });
}

/**
 * Maps cumulative spend to advisory actions. This does not enforce limits —
 * it produces recommendations operators can wire to gateways or feature flags.
 */
export function evaluateBudgets(
  rollups: CostRollups,
  policies: readonly BudgetPolicy[],
  anomalies: readonly AnomalyFinding[],
  events?: readonly EnrichedUsageEvent[],
): BudgetFinding[] {
  const out: BudgetFinding[] = [];

  for (const p of policies) {
    const spend = projectSpend(rollups, p.projectId);
    const latencyAdvisory = hasLatencyAnomalyForProject(anomalies, p.projectId);
    const slowConfigured =
      events?.some(
        (e) =>
          e.projectId === p.projectId && e.latencyMs >= p.latencyWarnMs,
      ) ?? false;

    if (spend >= p.hardLimitUsd) {
      out.push({
        projectId: p.projectId,
        action: "recommend_block",
        reason: `Estimated spend ${spend.toFixed(4)} meets or exceeds hard limit ${p.hardLimitUsd} (same units as pricing table).`,
      });
      continue;
    }

    if (spend >= p.softLimitUsd) {
      out.push({
        projectId: p.projectId,
        action: "recommend_throttle",
        reason: `Estimated spend ${spend.toFixed(4)} crossed soft limit ${p.softLimitUsd}.`,
      });
      continue;
    }

    if (latencyAdvisory || slowConfigured) {
      out.push({
        projectId: p.projectId,
        action: "warn",
        reason: latencyAdvisory
          ? "High-latency statistical anomaly for this project in this batch."
          : `One or more events exceeded configured latencyWarnMs (${p.latencyWarnMs}).`,
      });
      continue;
    }

    out.push({
      projectId: p.projectId,
      action: "none",
      reason: "Within configured soft limits for this demo window.",
    });
  }

  return out;
}
