# Production Reference Architecture Plan

This document describes a **focused, incremental path** to grow the repository from a **documentation-first catalog of blueprints** into a **TypeScript-first production reference**: shared packages, a small number of runnable reference applications, evaluation and benchmarking harnesses, and governance-oriented patterns—without replacing or renumbering the existing project catalog.

---

## Current State

### Catalog and content

- The repository contains **263 catalogued blueprint projects** (each with a primary row in the **Project catalog** section of [`README.md`](../README.md)).
- Each project lives under [`projects/`](../projects/) as `projects/<domain>/<project-slug>/` with:
  - **`README.md`** — problem, system type, complexity, stack guidance, evaluation, failure modes, production considerations, and related sections.
  - **`architecture.md`** — system overview, diagrams, data flow, scaling, observability, security-oriented notes, and appended **layer** guidance where the enrichment script has run.

### Source of truth and pointers

- The **authoritative registry** is **[`README.md` → Project catalog](../README.md#project-catalog)** (summary counts, domain tables, deduplication notes, contribution reminders).
- [`PROJECT_INDEX.md`](../PROJECT_INDEX.md) is a **short pointer** to that catalog section for stable links and tooling—not a second registry.

### Contribution and templates

- [`CONTRIBUTING.md`](../CONTRIBUTING.md) describes how to extend the catalog, avoid duplicates, and keep tone engineering-oriented.
- [`templates/project-template.md`](../templates/project-template.md) sketches the expected shape of new catalog entries (including stack and architecture expectations).

### Automation

- [`scripts/enrich_project_docs.py`](../scripts/enrich_project_docs.py) parses catalog rows from `README.md` and **idempotently** appends implementation-oriented blocks to project `README.md` and `architecture.md` (markers prevent duplicate inserts).
- [`scripts/apply_agentic_ui_projects.py`](../scripts/apply_agentic_ui_projects.py) with [`scripts/agentic_ui_projects.json`](../scripts/agentic_ui_projects.json) **generates** the **Agentic UI (AG-UI)** batch under `projects/agentic-ui/` from JSON (useful for regenerating that subset during development).

### Posture today

- The repo is **documentation-first**: it teaches **system design**, tradeoffs, and stack choices at scale across domains.
- There is **no requirement** that every blueprint become shipping code; value today is **clarity, breadth, and buildability guidance** in text.

---

## Target State

### What stays

- **The catalog remains the primary learning layer**—263 entries stay as blueprints; paths, tables, and per-project docs are not repurposed as “implemented product inventory.”

### What gets added (incrementally)

- **`packages/`** — small, **reusable TypeScript libraries** shared by reference apps (core types, runtime glue, optional adapters). Prefer narrow modules with clear boundaries over a monolithic “framework.”
- **`reference-implementations/`** — a **limited set** of **runnable** applications or services that **exemplify** patterns from the catalog (not one repo per catalog row).
- **`benchmarks/`** — scripts and fixtures to run **repeatable, local** measurements (latency, cost proxies, token usage, pass/fail gates). Results are **environment-dependent** and must be documented as such—no repository-embedded “official” benchmark tables presented as facts.
- **`docs/`** (beyond this plan) — **`production-patterns/`**, **`governance/`**, **`benchmarking/`** for **patterns**, **threat models**, **operational checklists**, and **how to interpret** harness output—not certifications.

### Relationship to the catalog

- Reference implementations **link back** to specific catalog paths (e.g. “this repo’s `reference-implementations/ai-cost-monitoring-engine` illustrates concepts from `projects/devtools/ai-cost-monitoring-engine`”) without implying the blueprint folder contains the runnable code.

---

## What We Will Not Do

- **Implement all 263 projects** as production code in this repository.
- **Publish fabricated ROI, conversion metrics, or comparative “wins”** as if they were measured outcomes of this repo.
- **Claim HIPAA, SOX, GDPR, SOC 2, or other compliance certifications** for the repository or for example code. Documentation may describe **controls you might implement** with legal and security review; it must not read as an audit attestation.
- **Overbuild enterprise-grade platform infrastructure** (multi-region control planes, exhaustive policy engines) **before** there is at least one **credible, runnable** reference path and a maintainable test story.
- **Alter the existing project catalog** as part of this plan (no mass renames, no renumbering contract, no replacing blueprint tables with build matrices).

---

## Proposed Repository Layout (Additive)

The following tree is **additive**. Existing folders (`projects/`, `scripts/`, `templates/`, `.cursor/`, etc.) remain as they are.

```text
packages/
  core/           # Shared types, run config, logging helpers, minimal runtime utilities
  governance/     # Policy hooks, redaction helpers, consent/audit interfaces (library-level, not legal advice)
  evals/          # Shared eval primitives: datasets loaders, scorers, report formats

reference-implementations/
  ai-cost-monitoring-engine/              # Runnable slice aligned with catalog: projects/devtools/ai-cost-monitoring-engine
  multi-agent-incident-response/         # Runnable slice aligned with catalog: projects/devops/multi-agent-incident-response-system
  enterprise-rag-knowledge-platform/     # Runnable slice aligned with catalog: projects/enterprise-ai/enterprise-rag-knowledge-platform

benchmarks/
  README.md                               # How to run locally; what varies by machine and keys
  scenarios/                              # Scenario definitions (inputs, expected gates—not “scores” as facts)
  scripts/                                # CLI entrypoints (e.g. pnpm exec …)

docs/
  PRODUCTION_REFERENCE_ARCHITECTURE_PLAN.md   # This file
  production-patterns/                        # ADRs, diagrams, “how we wire OTel here”
  governance/                                 # Data handling, RBAC patterns, review queues (non-certification)
  benchmarking/                               # Methodology: variance, ethics, reproducibility limits
```

**Naming note:** Reference implementation folder names are chosen to **mirror well-known catalog slugs** for discoverability. They are **new roots** under `reference-implementations/` and do **not** replace anything under `projects/`.

---

## Phases

Each phase lists **objective**, **deliverables**, and **acceptance criteria**. Phases may overlap slightly in practice, but the order reflects dependencies.

### Phase 0: Repository foundation

**Objective:** Make room for code, CI, and docs without confusing the catalog.

**Deliverables**

- Create top-level folders: `packages/`, `reference-implementations/`, `benchmarks/`, and `docs/production-patterns/`, `docs/governance/`, `docs/benchmarking/` (as empty or README-only stubs where appropriate).
- Root-level **workspace** definition (`pnpm-workspace.yaml`) including **`packages/*`**, **`reference-implementations/*`**, and **`benchmarks/`** so installs and builds are reproducible.
- Minimal **CI** on `main` / pull requests: **`pnpm install`**, **`pnpm run typecheck`**, **`pnpm test`**, and a **benchmark smoke** (mock data only). Root **`pnpm lint`** remains a placeholder until ESLint is added — CI does not fail on lint today.

**Acceptance criteria**

- A new contributor can clone the repo, install dependencies for the workspace, and run **`pnpm -r test`** (or chosen equivalent) with **zero tests failing** on main for the scaffolded packages (empty suites are not acceptable long term—prefer a minimal real test per package once code exists).

---

### Phase 1: Core runtime package

**Objective:** Establish a small **`packages/core`** library that reference apps can depend on for shared concerns (configuration boundaries, structured errors, correlation IDs, typed event envelopes).

**Deliverables**

- `packages/core` with TypeScript build, tests, and README describing **non-goals** (not a full agent framework).
- **Versioning policy (0.x)** documented in [`packages/core/README.md`](../packages/core/README.md) (workspace packages ship as `0.x` until API stability is declared).

**Acceptance criteria**

- Package **compiles** on supported Node LTS.
- **Unit tests** cover public surface area (even if small).
- No dependency on a specific cloud vendor in `core` (adapters live elsewhere).

---

### Phase 2: Governance package

**Objective:** Encode **library-level** helpers for patterns repeatedly described in blueprints: redaction helpers, safe logging wrappers, optional “policy decision” types, and documentation for human-in-the-loop hooks—**without** claiming regulatory compliance.

**Deliverables**

- `packages/governance` with APIs and docs that explicitly state **“patterns, not certifications.”**
- `docs/governance/` pages that map patterns to **example catalog entries** (links only).

**Acceptance criteria**

- Package compiles; tests pass.
- Documentation includes a **prominent disclaimer**: legal and security sign-off is required for production use; repo content is educational.

---

### Phase 3: AI Cost Monitoring flagship (reference implementation)

**Objective:** Ship one **runnable** slice of the **AI Cost Monitoring** blueprint as code under `reference-implementations/ai-cost-monitoring-engine/`, grounded in [`projects/devtools/ai-cost-monitoring-engine`](../projects/devtools/ai-cost-monitoring-engine).

**Deliverables**

- Minimal service or app: ingest **sample** usage events, aggregate, expose a read API and a small UI or CLI, optional export.
- Integration points for OTel or structured logs **demonstrated**, not maximized on day one.

**Acceptance criteria**

- **`README.md` in the reference folder** documents: prerequisites, env vars, how to run locally, and **explicit non-goals** (not production multi-tenant billing).
- **Smoke test** in CI that boots the stack in a constrained mode (Docker Compose or mocked providers acceptable).

---

### Phase 4: Multi-Agent Incident Response flagship

**Objective:** Demonstrate **multi-agent coordination** with explicit roles, shared state, and trace IDs—aligned with [`projects/devops/multi-agent-incident-response-system`](../projects/devops/multi-agent-incident-response-system).

**Deliverables**

- `reference-implementations/multi-agent-incident-response/` with a scripted scenario (synthetic incidents), agent boundaries, and a simple supervisor pattern.
- `docs/production-patterns/` ADR: when to fan out vs serialize; failure handling.

**Acceptance criteria**

- Runnable locally with documented mocks for external integrations.
- Tests cover **orchestration invariants** (e.g., no agent bypasses supervisor writes).

---

### Phase 5: Enterprise RAG Knowledge Platform flagship

**Objective:** Demonstrate **permission-aware retrieval** and safe answer shaping—aligned with [`projects/enterprise-ai/enterprise-rag-knowledge-platform`](../projects/enterprise-ai/enterprise-rag-knowledge-platform).

**Deliverables**

- `reference-implementations/enterprise-rag-knowledge-platform/` with synthetic corpora, ACL metadata on chunks, and citation-first responses.
- `packages/evals` initial hooks: regression datasets for “must cite / must refuse.”

**Acceptance criteria**

- Local run path documented; evals run in CI on **small** canned datasets.
- Clear documentation that **enterprise security** requires customer-specific controls beyond the demo.

---

### Phase 6: Benchmark harness

**Objective:** Provide **repeatable local measurement** for reference implementations: cold start, streaming latency bands, token accounting **from provider responses**, and scenario pass rates—**reported as artifacts**, not as repository “facts.”

**Deliverables**

- `benchmarks/` CLI with documented flags, deterministic seeds where applicable, and output formats (JSON lines, Markdown summary).
- `docs/benchmarking/` explaining variance sources (hardware, network, model version, key quotas).

**Acceptance criteria**

- Running the harness on a clean machine produces **a report file** with environment metadata captured.
- CI may run a **subset** marked “smoke” (strict time bounds); full sweeps remain manual or scheduled.

---

### Phase 7: Thought leadership docs

**Objective:** Consolidate **patterns** learned from building the three flagships into concise, linkable docs that complement—not replace—the catalog.

**Deliverables**

- `docs/production-patterns/` series (short, reviewable articles).
- Cross-links from relevant **catalog** rows (optional, small README additions only where maintainers agree).

**Acceptance criteria**

- Each article lists **assumptions**, **non-goals**, and **links** to the blueprint(s) it illustrates.
- No hype adjectives; no unverifiable quantitative claims.

---

## Success Criteria (Realistic)

- **Packages compile** on the supported Node/TypeScript matrix declared in the workspace.
- **Tests pass** in CI for code under `packages/` and `reference-implementations/` that is marked “supported.”
- **At least one flagship** reference implementation can be brought up **locally** following its README without undisclosed external paid services (mock mode acceptable).
- **Benchmark scripts** produce **local, labeled outputs** (environment + git SHA + model identifiers when applicable), stored as artifacts—not committed as canonical performance tables.
- **Documentation** explains patterns clearly enough that a mid-level TypeScript engineer can map blueprint → runnable demo → packages they might reuse.

---

## Risk Management

| Risk | Mitigation |
|------|------------|
| **Scope creep** | Cap flagships at three until maintainers agree otherwise; require ADR for new reference apps. |
| **Fake metrics** | Ban fabricated numbers in docs; benchmark outputs are **artifacts**, always with context; prefer thresholds and pass/fail gates over leaderboard narratives. |
| **Compliance overclaiming** | Use “controls to consider” language; separate **legal review** from engineering patterns; never imply certification. |
| **Maintenance burden** | Pin dependencies conservatively; keep reference apps **small**; retire or archive demos that cannot be kept green. |
| **Unfinished code risk** | Prefer **feature flags inside references** (“demo mode” vs “integration mode”); mark experimental dirs explicitly; do not imply catalog completeness equals code completeness. |

---

## Summary

This plan keeps the **263-project catalog** as the **spine of learning and discovery**, and adds a **thin, credible code layer**—packages, three reference implementations, benchmarks, and deeper docs—that demonstrates **production-minded TypeScript AI systems** without pretending the entire catalog is implemented or measured.
