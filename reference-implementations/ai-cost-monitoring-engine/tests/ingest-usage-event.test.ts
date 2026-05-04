import { describe, expect, it } from "vitest";
import { UsageEventStore } from "../src/ingest-usage-event.js";
import { demoPricing } from "../src/mock-data.js";

describe("UsageEventStore.ingest", () => {
  it("rejects invalid rows with a clear Zod error", () => {
    const store = new UsageEventStore();
    const pricing = demoPricing();
    expect(() =>
      store.ingest(pricing, {
        runId: "",
        projectId: "p",
        model: "demo-fast",
        inputTokens: 1,
        outputTokens: 0,
        latencyMs: 0,
        timestamp: 0,
      }),
    ).toThrow(/runId/i);

    expect(() =>
      store.ingest(pricing, {
        runId: "r",
        projectId: "p",
        model: "demo-fast",
        inputTokens: -1,
        outputTokens: 0,
        latencyMs: 0,
        timestamp: 0,
      }),
    ).toThrow(/inputTokens/i);
  });
});
