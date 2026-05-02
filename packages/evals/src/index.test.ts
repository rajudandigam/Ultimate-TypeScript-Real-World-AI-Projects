import { describe, expect, it } from "vitest";
import { defineEvalCase } from "./index.js";

describe("defineEvalCase", () => {
  it("returns the same case", () => {
    const c = defineEvalCase({ id: "1", input: "hi" });
    expect(c.id).toBe("1");
  });
});
