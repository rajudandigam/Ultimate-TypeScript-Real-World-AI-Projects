import { describe, expect, it } from "vitest";
import { detectPII, redactPII } from "./pii-redactor.js";

describe("detectPII", () => {
  it("detects email-like patterns", () => {
    const text = "Reach me at jane.doe@example.com soon.";
    const m = detectPII(text);
    expect(m.some((x) => x.type === "email")).toBe(true);
    const email = m.find((x) => x.type === "email");
    expect(text.slice(email!.start, email!.end)).toBe("jane.doe@example.com");
  });

  it("detects SSN-like patterns", () => {
    const text = "id 123-45-6789 end";
    const m = detectPII(text);
    expect(m.some((x) => x.type === "ssn")).toBe(true);
  });
});

describe("redactPII", () => {
  it("removes email substring", () => {
    const out = redactPII("mail: a@b.co and done");
    expect(out).not.toContain("@");
    expect(out).toContain("[REDACTED]");
  });
});
