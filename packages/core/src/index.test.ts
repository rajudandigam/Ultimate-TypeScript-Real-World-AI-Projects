import { describe, expect, it } from "vitest";
import { createCorrelationId } from "./index.js";

describe("createCorrelationId", () => {
  it("returns a non-empty string", () => {
    expect(createCorrelationId().length).toBeGreaterThan(4);
  });
});
