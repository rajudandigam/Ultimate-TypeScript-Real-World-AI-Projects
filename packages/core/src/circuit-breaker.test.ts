import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CircuitBreaker,
  CircuitBreakerOpenError,
} from "./circuit-breaker.js";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("CircuitBreaker", () => {
  it("opens after repeated failures", async () => {
    const cb = new CircuitBreaker({
      failureThreshold: 2,
      resetTimeoutMs: 10_000,
    });

    await expect(
      cb.execute(async () => {
        throw new Error("x");
      }),
    ).rejects.toThrow("x");
    expect(cb.getState()).toBe("closed");

    await expect(
      cb.execute(async () => {
        throw new Error("y");
      }),
    ).rejects.toThrow("y");
    expect(cb.getState()).toBe("open");

    await expect(
      cb.execute(async () => "ok"),
    ).rejects.toBeInstanceOf(CircuitBreakerOpenError);
  });

  it("enters half-open after reset timeout and can close on success", async () => {
    vi.useFakeTimers();
    const now = vi.spyOn(Date, "now");
    let t = 0;
    now.mockImplementation(() => t);

    const cb = new CircuitBreaker({
      failureThreshold: 1,
      resetTimeoutMs: 1_000,
    });

    await expect(
      cb.execute(async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    expect(cb.getState()).toBe("open");

    t = 2_000;
    const out = await cb.execute(async () => "recovered");
    expect(out).toBe("recovered");
    expect(cb.getState()).toBe("closed");
  });

  it("re-opens from half-open on failure", async () => {
    vi.useFakeTimers();
    const now = vi.spyOn(Date, "now");
    let t = 0;
    now.mockImplementation(() => t);

    const cb = new CircuitBreaker({
      failureThreshold: 1,
      resetTimeoutMs: 100,
    });

    await expect(
      cb.execute(async () => {
        throw new Error("a");
      }),
    ).rejects.toThrow("a");

    t = 200;
    await expect(
      cb.execute(async () => {
        throw new Error("b");
      }),
    ).rejects.toThrow("b");
    expect(cb.getState()).toBe("open");
  });
});
