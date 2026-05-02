import { describe, expect, it } from "vitest";
import { detectAnomalies } from "../src/anomaly-detector.js";
import type { CostRollups, EnrichedUsageEvent } from "../src/types.js";

function emptyRollups(): CostRollups {
  return {
    byProject: new Map(),
    byModel: new Map(),
    byRun: new Map(),
    byDay: new Map(),
  };
}

function fakeEvent(p: Partial<EnrichedUsageEvent>): EnrichedUsageEvent {
  return {
    runId: "run",
    projectId: "proj",
    model: "demo-fast",
    inputTokens: 100,
    outputTokens: 100,
    latencyMs: 200,
    timestamp: Date.UTC(2026, 0, 1),
    eventId: "evt_test",
    costEstimate: {
      model: "demo-fast",
      currency: "USD",
      promptCost: 0.0001,
      completionCost: 0.0002,
      total: 0.0003,
    },
    ...p,
  };
}

describe("detectAnomalies", () => {
  it("flags a cost spike on the last day vs trailing average", () => {
    const events: EnrichedUsageEvent[] = [];
    const baseCost = 0.01;
    for (let d = 0; d < 3; d++) {
      events.push(
        fakeEvent({
          eventId: `e-${d}`,
          timestamp: Date.UTC(2026, 0, 1 + d),
          costEstimate: {
            model: "demo-fast",
            currency: "USD",
            promptCost: baseCost,
            completionCost: 0,
            total: baseCost,
          },
        }),
      );
    }
    events.push(
      fakeEvent({
        eventId: "e-spike",
        timestamp: Date.UTC(2026, 0, 5),
        costEstimate: {
          model: "demo-fast",
          currency: "USD",
          promptCost: 1,
          completionCost: 0,
          total: 1,
        },
      }),
    );

    const findings = detectAnomalies(events, emptyRollups());
    expect(findings.some((f) => f.type === "cost_spike")).toBe(true);
  });

  it("flags high latency relative to cohort median", () => {
    const events = Array.from({ length: 10 }, (_, i) =>
      fakeEvent({
        eventId: `e-${i}`,
        latencyMs: 200 + i,
        timestamp: Date.UTC(2026, 0, 10, i),
      }),
    );
    events.push(
      fakeEvent({
        eventId: "e-slow",
        latencyMs: 20_000,
        timestamp: Date.UTC(2026, 0, 10, 12),
      }),
    );

    const findings = detectAnomalies(events, emptyRollups());
    expect(findings.some((f) => f.type === "high_latency")).toBe(true);
  });
});
