import { describe, expect, it } from "vitest";
import {
  runInputGuardrails,
  runOutputGuardrails,
  type InputGuardrail,
  type OutputGuardrail,
} from "./guardrails.js";

describe("runInputGuardrails", () => {
  it("passes when all guardrails ok", async () => {
    const r = await runInputGuardrails("hello", []);
    expect(r).toEqual({ ok: true });
  });

  it("stops on first tripwire", async () => {
    const trip: InputGuardrail = (input) =>
      input.includes("SECRET")
        ? { ok: false, reason: "blocked token", code: "leak" }
        : { ok: true };

    const r = await runInputGuardrails("prefix SECRET suffix", [trip]);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toContain("blocked");
      expect(r.code).toBe("leak");
    }
  });
});

describe("runOutputGuardrails", () => {
  it("stops on first failing output check", async () => {
    const g: OutputGuardrail = (out) =>
      out.length > 10 ? { ok: false, reason: "too long" } : { ok: true };

    const r = await runOutputGuardrails("12345678901", [g]);
    expect(r.ok).toBe(false);
  });
});
