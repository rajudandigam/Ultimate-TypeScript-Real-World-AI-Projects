import { describe, expect, it } from "vitest";
import { emitAuditEvent } from "./index.js";

describe("emitAuditEvent", () => {
  it("returns the same event object", () => {
    const evt = { level: "info" as const, message: "ok" };
    expect(emitAuditEvent(evt)).toEqual(evt);
  });
});
