# @repo/core

Reusable **runtime primitives** for workflows, agents, multi-agent orchestration, tools, retries, durable run state, and typed messages.

**Status:** scaffold only — APIs will grow alongside `reference-implementations/` flagships.

## Scripts

- `pnpm typecheck` — `tsc --noEmit` (strict)
- `pnpm test` — `vitest run`

## Non-goals

- Not a full agent framework or orchestration engine.
- No vendor-specific LLM SDKs in this package (keep adapters elsewhere).
