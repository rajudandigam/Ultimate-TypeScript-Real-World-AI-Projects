import { describe, expect, it } from "vitest";
import { InMemoryRunStateStore } from "./run-state.js";

describe("InMemoryRunStateStore", () => {
  it("put and get round-trip", () => {
    const store = new InMemoryRunStateStore();
    const state = {
      runId: "r1",
      status: "running" as const,
      payload: { n: 1 },
      version: 0,
      updatedAtMs: 1,
    };
    store.put(state);
    expect(store.get("r1")).toEqual(state);
  });

  it("compareAndSet bumps version when expected matches", () => {
    const store = new InMemoryRunStateStore();
    store.put({
      runId: "r1",
      status: "pending",
      payload: null,
      version: 0,
      updatedAtMs: 0,
    });

    const next = store.compareAndSet("r1", 0, { status: "running" });
    expect(next?.version).toBe(1);
    expect(next?.status).toBe("running");
    expect(store.get("r1")?.version).toBe(1);
  });

  it("compareAndSet returns undefined on version mismatch", () => {
    const store = new InMemoryRunStateStore();
    store.put({
      runId: "r1",
      status: "pending",
      payload: null,
      version: 2,
      updatedAtMs: 0,
    });

    expect(store.compareAndSet("r1", 0, { status: "failed" })).toBeUndefined();
    expect(store.get("r1")?.status).toBe("pending");
  });
});
