# @repo/core

Reusable **runtime primitives** for workflows, agents, multi-agent orchestration, tools, retries, durable run state, and typed messages.

**Versioning:** **`0.x`** — breaking changes may occur while reference implementations and the catalog evolve together. Pin a lockfile commit or version range in consuming apps.

**Status:** first practical slice — types, tools (Zod-shaped), sequential workflows, agent message shapes, in-memory run state, retry/backoff, circuit breaker, JSON logging, and OTel-shaped tracing hooks.

## Scripts

- `pnpm typecheck` — `tsc --noEmit` (strict)
- `pnpm test` — `vitest run`

## Dependencies

- **zod** — `ToolDefinition` / `ToolInput` / `ToolOutput` use `z.ZodTypeAny` and `z.infer` for schema-safe typing.

## Non-goals

- Not a full agent framework or orchestration engine.
- No vendor-specific LLM SDKs in this package (keep adapters elsewhere).
