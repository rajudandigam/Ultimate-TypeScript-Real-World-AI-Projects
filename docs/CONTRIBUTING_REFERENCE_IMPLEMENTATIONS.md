# Contributing — reference implementations & production layer

This guide applies to **`packages/`**, **`reference-implementations/`**, **`benchmarks/`**, and related CI — **not** to catalog markdown under **`projects/`** (those stay governed by [`CONTRIBUTING.md`](../CONTRIBUTING.md)).

High-level roadmap: [`PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md`](./PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md).

---

## What qualifies as a reference implementation

A folder under [`reference-implementations/`](../reference-implementations/) should be a **credible, minimal slice** of a catalog blueprint — not a second registry and not a claim that every blueprint is shipped code.

| Criterion | Expectation |
|-----------|-------------|
| **Runnable locally** | A new contributor can follow the README and run the demo path **without** vendor accounts, **without** secrets, and **without** calling external LLM APIs unless the README documents an **explicit opt-in** path. |
| **TypeScript strict mode** | `strict` (and repo-aligned compiler options) in the package `tsconfig.json`; no “loosen types to green CI.” |
| **Tests** | `pnpm test` (or package equivalent) runs **Vitest** (or agreed runner) with meaningful coverage of boundaries, policies, and pure logic — not an empty suite. |
| **Governance integration** | Use [`@repo/governance`](../packages/governance/README.md) patterns where the story needs them: audit-friendly logging, cost estimates when LLM usage exists, redaction before persisting user-like text, rate limits for mock “integrations,” etc. |
| **Clear architecture** | `architecture.md` explains data flow, agent/workflow boundaries, and failure modes; diagrams can be text-based. |
| **No fake production claims** | Do not imply SOC 2 / HIPAA / “enterprise certified,” fabricated ROI, or benchmark superiority without controlled reproduction (see [Benchmark requirements](#benchmark-requirements)). |

---

## Minimum requirements

Each new **reference implementation** should include at least:

| Artifact | Purpose |
|----------|---------|
| **`README.md`** | What it demonstrates, link to the **catalog** path, how to run locally, limitations, non-goals. |
| **`architecture.md`** | Modules, data flow, governance touchpoints, observability seams, failure modes. |
| **`PRODUCTION_GUIDE.md`** | How to swap mocks for real stores/APIs, deploy shape, OTel hooks — **patterns**, not legal advice. |
| **`package.json`** | Workspace package with `typecheck`, `test`, and a clear `start` (or documented entry). |
| **`src/`** | Typed application / library code; keep boundaries explicit. |
| **`tests/`** | Automated tests; no network for default `pnpm test`. |
| **`.env.example`** | Document optional vars; defaults must allow **zero secrets** for CI and local smoke. |
| **Mock data** | Deterministic fixtures or in-memory generators so CI and contributors get the same shape of behavior. |

Optional but encouraged: `benchmarks/` notes or a suite under repo [`benchmarks/`](../benchmarks/README.md) for local timing smoke.

---

## Required engineering standards

| Standard | Guidance |
|----------|----------|
| **Typed inputs** | Public boundaries use explicit TypeScript types; avoid `unknown` at API edges without narrowing. |
| **Zod validation** | Use **Zod** (or equivalent) at HTTP/webhook boundaries and tool payloads **where JSON or external shape enters** the system. |
| **Structured errors** | Prefer discriminated results or typed errors (e.g. patterns from [`@repo/core`](../packages/core/README.md)) over opaque strings; loggable `code` / `reason` fields help operators. |
| **Audit logging when decisions are made** | State transitions, approvals/denials, and integration side effects should emit **structured audit events** (see `@repo/governance` `AuditLogger` / `InMemoryAuditLogger` for demos). |
| **Cost tracking when LLM calls are involved** | If the reference calls models, record **token usage** and apply **`@repo/governance`** cost estimation with **caller-owned pricing**; if the slice is deterministic-only, document `cost: 0` / `mode: stub` explicitly. |
| **No external API dependency for tests** | Default `pnpm test` must pass **offline** with mocks/fixtures; contract tests with recorded HTTP are a later, opt-in layer. |

---

## Benchmark requirements

| Rule | Detail |
|------|--------|
| **Local reproducible scripts** | Prefer the shared harness under [`benchmarks/`](../benchmarks/README.md) or document a single `pnpm …` entry in the reference README. |
| **Transparent methodology** | Link [`benchmarks/methodology.md`](../benchmarks/methodology.md); record environment metadata when writing artifacts. |
| **No fabricated results** | Do not commit “official” benchmark tables as facts; do not cherry-pick a best run as a marketing number. |

---

## Compliance language rules

This repository teaches **engineering patterns**. Example code and docs are **not** audit deliverables.

| Do | Don’t |
|----|--------|
| Describe **reference controls** — patterns teams *might* implement after legal and security review. | Say the repo, a folder, or a snippet is **“certified compliant”** with HIPAA, SOC 2, GDPR, SOX, PCI, etc. |
| Point readers to organizational policy, DPIA, legal review, and vendor DLP where relevant. | Imply **warranties**, **guaranteed outcomes**, or **regulatory sign-off** from documentation alone. |
| Use precise operational language: guardrails, approvals, audit trails, least privilege. | Use **absolute legal conclusions** (“this design satisfies GDPR”) without counsel. |

When in doubt, say: **“reference control — not a certification.”**

---

## PR checklist (reference implementations & packages)

Use this in addition to the normal [`CONTRIBUTING.md`](../CONTRIBUTING.md) rules when you touch **`packages/`**, **`reference-implementations/`**, or **`benchmarks/`**.

- [ ] **Catalog link** — README names the matching `projects/<domain>/<slug>/` blueprint (no renumbering of catalog rows).
- [ ] **Artifacts** — `README.md`, `architecture.md`, `PRODUCTION_GUIDE.md`, `.env.example`, `src/`, `tests/` present (per [Minimum requirements](#minimum-requirements)).
- [ ] **Strict TypeScript** — `pnpm run typecheck` passes for the workspace package(s) you changed.
- [ ] **Tests** — `pnpm test` passes; tests do not require secrets or live vendor APIs by default.
- [ ] **Governance** — Audit and/or cost hooks present where the feature story includes decisions, side effects, or LLM calls; PII-aware paths use redaction or avoid logging secrets.
- [ ] **Benchmarks** — If you add timing harnesses, follow [Benchmark requirements](#benchmark-requirements) and keep outputs **local / honest**.
- [ ] **Language** — No compliance certifications or fabricated metrics; use **reference control** framing ([Compliance language rules](#compliance-language-rules)).
- [ ] **CI** — [`.github/workflows/production-reference-ci.yml`](../.github/workflows/production-reference-ci.yml) stays green (typecheck, test, benchmark smoke).

---

## Questions

Open an issue with **which catalog row** you are implementing, **scope** (what you are explicitly *not* building in v1), and **risk surface** (data, paging, mutations). That keeps reference PRs reviewable and aligned with the plan.
