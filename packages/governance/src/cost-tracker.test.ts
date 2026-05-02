import { describe, expect, it } from "vitest";
import {
  aggregateCostByRun,
  calculateCost,
  type PricingConfig,
} from "./cost-tracker.js";

const pricing: PricingConfig = {
  models: {
    "demo-model": { promptPerMillion: 3, completionPerMillion: 6 },
  },
  fallback: { promptPerMillion: 1, completionPerMillion: 2 },
};

describe("calculateCost", () => {
  it("uses model-specific pricing", () => {
    const est = calculateCost(
      {
        model: "demo-model",
        promptTokens: 1_000_000,
        completionTokens: 500_000,
      },
      pricing,
    );
    expect(est.promptCost).toBeCloseTo(3);
    expect(est.completionCost).toBeCloseTo(3);
    expect(est.total).toBeCloseTo(6);
    expect(est.currency).toBe("USD");
  });

  it("uses fallback when model is unknown", () => {
    const est = calculateCost(
      {
        model: "unknown",
        promptTokens: 2_000_000,
        completionTokens: 0,
      },
      pricing,
    );
    expect(est.promptCost).toBeCloseTo(2);
    expect(est.total).toBeCloseTo(2);
  });

  it("throws when no pricing and no fallback", () => {
    expect(() =>
      calculateCost(
        { model: "x", promptTokens: 1, completionTokens: 1 },
        { models: {} },
      ),
    ).toThrow(/No pricing/);
  });
});

describe("aggregateCostByRun", () => {
  it("groups totals by runId", () => {
    const map = aggregateCostByRun(
      [
        {
          runId: "r1",
          usage: { model: "demo-model", promptTokens: 1e6, completionTokens: 0 },
        },
        {
          runId: "r1",
          usage: { model: "demo-model", promptTokens: 0, completionTokens: 1e6 },
        },
        {
          runId: "r2",
          usage: { model: "unknown", promptTokens: 1e6, completionTokens: 0 },
        },
      ],
      pricing,
    );

    const r1 = map.get("r1");
    expect(r1?.total).toBeCloseTo(9);
    expect(r1?.byModel["demo-model"]).toBeCloseTo(9);

    const r2 = map.get("r2");
    expect(r2?.total).toBeCloseTo(1);
  });
});
