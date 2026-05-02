import { describe, expect, it } from "vitest";
import { evaluateBudgets, type BudgetPolicy } from "../src/budget-policy.js";
import type { CostRollups } from "../src/types.js";

function rollupsFrom(projectTotals: Record<string, number>): CostRollups {
  return {
    byProject: new Map(Object.entries(projectTotals)),
    byModel: new Map(),
    byRun: new Map(),
    byDay: new Map(),
  };
}

describe("evaluateBudgets", () => {
  const policies: BudgetPolicy[] = [
    { projectId: "p1", softLimitUsd: 5, hardLimitUsd: 20, latencyWarnMs: 1000 },
  ];

  it("recommends block at hard limit", () => {
    const r = evaluateBudgets(rollupsFrom({ p1: 25 }), policies, []);
    expect(r[0]?.action).toBe("recommend_block");
  });

  it("recommends throttle between soft and hard", () => {
    const r = evaluateBudgets(rollupsFrom({ p1: 7 }), policies, []);
    expect(r[0]?.action).toBe("recommend_throttle");
  });

  it("warns on configured latency threshold", () => {
    const r = evaluateBudgets(
      rollupsFrom({ p1: 0.1 }),
      policies,
      [],
      [
        {
          runId: "r",
          projectId: "p1",
          model: "demo-fast",
          inputTokens: 1,
          outputTokens: 1,
          latencyMs: 2000,
          timestamp: 0,
          eventId: "e1",
          costEstimate: {
            model: "demo-fast",
            currency: "USD",
            promptCost: 0,
            completionCost: 0,
            total: 0.1,
          },
        },
      ],
    );
    expect(r[0]?.action).toBe("warn");
  });
});
