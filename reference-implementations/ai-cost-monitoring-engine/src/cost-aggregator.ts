import type { CostRollups, EnrichedUsageEvent } from "./types.js";

function utcDayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/** Sums estimated spend and token volumes for dashboard-style rollups. */
export function aggregateCosts(events: readonly EnrichedUsageEvent[]): CostRollups {
  const byProject = new Map<string, number>();
  const byModel = new Map<string, number>();
  const byRun = new Map<string, number>();
  const byDay = new Map<string, number>();

  for (const e of events) {
    const c = e.costEstimate.total;
    byProject.set(e.projectId, (byProject.get(e.projectId) ?? 0) + c);
    byModel.set(e.model, (byModel.get(e.model) ?? 0) + c);
    byRun.set(e.runId, (byRun.get(e.runId) ?? 0) + c);
    const day = utcDayKey(e.timestamp);
    byDay.set(day, (byDay.get(day) ?? 0) + c);
  }

  return { byProject, byModel, byRun, byDay };
}

export function rollupToPlainObject(
  rollups: CostRollups,
): Record<string, Record<string, number>> {
  return {
    byProject: Object.fromEntries(rollups.byProject),
    byModel: Object.fromEntries(rollups.byModel),
    byRun: Object.fromEntries(rollups.byRun),
    byDay: Object.fromEntries(rollups.byDay),
  };
}
