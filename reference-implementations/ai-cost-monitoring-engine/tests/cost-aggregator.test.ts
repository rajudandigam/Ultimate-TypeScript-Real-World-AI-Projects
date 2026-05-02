import { describe, expect, it } from "vitest";
import { aggregateCosts } from "../src/cost-aggregator.js";
import { UsageEventStore } from "../src/ingest-usage-event.js";
import { demoPricing } from "../src/mock-data.js";

describe("aggregateCosts", () => {
  it("sums totals by project, model, run, and UTC day", () => {
    const pricing = demoPricing();
    const store = new UsageEventStore();
    const t0 = Date.UTC(2026, 1, 2, 12, 0, 0);
    store.ingest(pricing, {
      runId: "r1",
      projectId: "p-a",
      model: "demo-fast",
      inputTokens: 1_000_000,
      outputTokens: 0,
      latencyMs: 100,
      timestamp: t0,
    });
    store.ingest(pricing, {
      runId: "r1",
      projectId: "p-a",
      model: "demo-large",
      inputTokens: 0,
      outputTokens: 1_000_000,
      latencyMs: 200,
      timestamp: t0,
    });
    store.ingest(pricing, {
      runId: "r2",
      projectId: "p-b",
      model: "demo-fast",
      inputTokens: 0,
      outputTokens: 0,
      latencyMs: 50,
      timestamp: t0,
    });

    const rollups = aggregateCosts(store.all());

    expect(rollups.byProject.get("p-a")).toBeCloseTo(1 + 15);
    expect(rollups.byProject.get("p-b")).toBeCloseTo(0);
    expect(rollups.byModel.get("demo-fast")).toBeCloseTo(1);
    expect(rollups.byModel.get("demo-large")).toBeCloseTo(15);
    expect(rollups.byRun.get("r1")).toBeCloseTo(16);
    expect(rollups.byRun.get("r2")).toBeCloseTo(0);
    expect(rollups.byDay.get("2026-02-02")).toBeCloseTo(16);
  });
});
