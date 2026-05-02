import type { z } from "zod";

/**
 * Describes a callable tool with Zod-validated input/output shapes.
 * Use `z.infer` at call sites for typed payloads.
 */
export interface ToolDefinition<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
> {
  name: string;
  description?: string;
  inputSchema: TInput;
  outputSchema: TOutput;
}

export type ToolInput<Schema extends z.ZodTypeAny> = z.infer<Schema>;

export type ToolOutput<Schema extends z.ZodTypeAny> = z.infer<Schema>;

export type ToolExecutor<
  TInput extends z.ZodTypeAny,
  TOutput extends z.ZodTypeAny,
> = (input: z.infer<TInput>) => Promise<z.infer<TOutput>>;
