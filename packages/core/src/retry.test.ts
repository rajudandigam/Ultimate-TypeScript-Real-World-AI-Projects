import { describe, expect, it, vi } from "vitest";
import { retryWithBackoff } from "./retry.js";

describe("retryWithBackoff", () => {
  it("returns value on first success", async () => {
    const fn = vi.fn().mockResolvedValueOnce(42);
    const r = await retryWithBackoff(fn, {
      maxAttempts: 3,
      initialDelayMs: 0,
      jitter: false,
    });
    expect(r).toEqual({ ok: true, value: 42, attempts: 1 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries until success", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error("a"))
      .mockRejectedValueOnce(new Error("b"))
      .mockResolvedValueOnce("ok");

    const r = await retryWithBackoff(fn, {
      maxAttempts: 5,
      initialDelayMs: 0,
      jitter: false,
    });
    expect(r).toEqual({ ok: true, value: "ok", attempts: 3 });
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("returns typed error after exhausting attempts", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fail"));

    const r = await retryWithBackoff(
      fn,
      { maxAttempts: 2, initialDelayMs: 0, jitter: false },
      (e) => (e instanceof Error ? e.message : "unknown"),
    );

    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toBe("fail");
      expect(r.attempts).toBe(2);
    }
  });

  it("does not retry when isRetryable returns false", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("fatal"));
    const r = await retryWithBackoff(fn, {
      maxAttempts: 5,
      initialDelayMs: 0,
      jitter: false,
      isRetryable: () => false,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.attempts).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
