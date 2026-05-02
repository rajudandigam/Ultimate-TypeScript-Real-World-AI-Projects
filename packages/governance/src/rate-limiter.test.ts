import { afterEach, describe, expect, it, vi } from "vitest";
import { InMemoryTokenBucketLimiter } from "./rate-limiter.js";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("InMemoryTokenBucketLimiter", () => {
  it("rejects when bucket is empty", () => {
    const lim = new InMemoryTokenBucketLimiter({
      capacity: 2,
      refillPerSecond: 0,
    });
    expect(lim.tryAcquire("user-1", 1)).toBe(true);
    expect(lim.tryAcquire("user-1", 1)).toBe(true);
    expect(lim.tryAcquire("user-1", 1)).toBe(false);
  });

  it("isolates keys", () => {
    const lim = new InMemoryTokenBucketLimiter({
      capacity: 1,
      refillPerSecond: 0,
    });
    expect(lim.tryAcquire("a", 1)).toBe(true);
    expect(lim.tryAcquire("b", 1)).toBe(true);
  });

  it("refills over time", () => {
    vi.useFakeTimers();
    const now = vi.spyOn(Date, "now");
    let t = 0;
    now.mockImplementation(() => t);

    const lim = new InMemoryTokenBucketLimiter({
      capacity: 1,
      refillPerSecond: 1,
    });
    expect(lim.tryAcquire("k", 1)).toBe(true);
    expect(lim.tryAcquire("k", 1)).toBe(false);

    t = 1000;
    expect(lim.tryAcquire("k", 1)).toBe(true);
  });
});
