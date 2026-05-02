import { describe, expect, it } from "vitest";
import { createCorrelationId } from "./types.js";
import { runWorkflow } from "./workflow.js";

describe("runWorkflow", () => {
  it("runs steps sequentially and exposes outputs in variables", async () => {
    const order: string[] = [];
    const ctx = {
      trace: { correlationId: createCorrelationId() },
      variables: {} as Record<string, unknown>,
    };

    const result = await runWorkflow(
      [
        {
          id: "a",
          execute: async () => {
            order.push("a");
            return 1;
          },
        },
        {
          id: "b",
          execute: async (c) => {
            order.push("b");
            return (c.variables.a as number) + 1;
          },
        },
      ],
      ctx,
    );

    expect(order).toEqual(["a", "b"]);
    expect(result.status).toBe("succeeded");
    expect(result.stepResults).toEqual({ a: 1, b: 2 });
    expect(ctx.variables).toEqual({ a: 1, b: 2 });
  });

  it("stops on first error", async () => {
    const ctx = {
      trace: { correlationId: createCorrelationId() },
      variables: {} as Record<string, unknown>,
    };

    const result = await runWorkflow(
      [
        { id: "one", execute: async () => 1 },
        {
          id: "bad",
          execute: async () => {
            throw new Error("nope");
          },
        },
        { id: "skip", execute: async () => "never" },
      ],
      ctx,
    );

    expect(result.status).toBe("failed");
    expect(result.failedStepId).toBe("bad");
    expect(result.error).toBe("nope");
    expect(result.stepResults).toEqual({ one: 1 });
  });
});
