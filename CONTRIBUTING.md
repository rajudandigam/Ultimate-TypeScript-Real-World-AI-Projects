# Contributing

Thank you for helping improve this catalog. The goal is **high-signal, production-minded system designs** in **TypeScript**, not a longer list of generic assistants.

---

## Before you open a PR

1. Read this document and the [**Complexity levels**](README.md#complexity-levels) / [**System types**](README.md#system-types-short) sections in [`README.md`](README.md) so tags stay consistent with the rest of the catalog.
2. Search the [**Project catalog**](README.md#project-catalog) in [`README.md`](README.md) for similar names and problems. **Avoid duplicates** and near-duplicates (renamed chatbots). [`PROJECT_INDEX.md`](PROJECT_INDEX.md) is only a pointer to that section.
3. Prefer contributions that teach **workflow vs agent vs multi-agent** tradeoffs, **guardrails**, **evaluation**, or **observability**.

---

## What we want

- **Distinct problems** with a defensible system type and complexity level.
- **Buildable** blueprints: clear inputs, components, data flow, and failure modes.
- **TypeScript-first** stacks (Node, Next.js, agents SDKs, workflow engines, MCP, etc.) where the idea naturally fits.
- Writing that is **plain, engineering-oriented**, and free of shallow AI marketing. Prefer concrete terms: orchestration, guardrails, tracing, human-in-the-loop, evaluation.

## What we avoid

- Generic “AI assistant for X” with no architecture angle.
- Fillers that differ only by domain label from an existing row.
- Ideas that are mostly research-lab setup with little product or TS relevance.
- Overhyped language (“revolutionary”, “game-changing”, “magical”, and similar).

---

## Adding or updating a catalog project

### 1. Location

Use a domain folder under [`projects/`](projects/) that matches the problem (examples: [`devtools`](projects/devtools/), [`travel`](projects/travel/), [`enterprise-ai`](projects/enterprise-ai/), [`security`](projects/security/)). Path shape:

```text
projects/<domain>/<project-slug>/
  README.md
  architecture.md
```

Use **kebab-case** slugs. If no domain fits, pick the closest industry bucket rather than inventing many new top-level domains.

### 2. `README.md`

Mirror the **headings and depth** of an existing sibling in the same domain (for example [`projects/travel/ai-travel-planner/README.md`](projects/travel/ai-travel-planner/README.md)). Every brief should make it obvious:

- **Problem** and **why it matters**
- **System type** (workflow, single agent, multi-agent) and **why**
- **Complexity** (L1–L5): follow the definitions in [**Complexity levels**](README.md#complexity-levels) and stay **consistent** with how similar systems are tagged in the [Project catalog](README.md#project-catalog)
- **Industry** and **capabilities**
- **Suggested TypeScript stack**
- **Architecture** (high level), **implementation steps**, **evaluation**
- **Failure cases** and **production considerations**
- **Evolution path** (e.g. workflow → agent) where it helps

Keep tone practical; match existing projects in the same domain when unsure.

### 3. `architecture.md`

Complement the README with **engineering depth**, not a repeat of the marketing summary. Typical sections (adapt as needed):

- System overview and **text diagram** of components
- Core components and **data flow**
- Agent roles and orchestration (if applicable)
- Scaling, caching, async patterns
- Failure handling and security boundaries

See any existing pair under `projects/` for rhythm and depth.

### 4. Register the project

Add **exactly one** primary row to the correct domain table in the [**Project catalog**](README.md#project-catalog) section of [`README.md`](README.md):

- **Name**, **System Type**, **Complexity**, **Capabilities**, **Path** (directory only, no trailing slash)
- Update **summary counts** in that same section if totals change (see the counting note there).

Do not list the same conceptual project twice under different domains unless the **system behavior** is genuinely different (rare).

---

## PR checklist

- [ ] Checked the [Project catalog](README.md#project-catalog) for duplicates.
- [ ] `README.md` + `architecture.md` present under `projects/<domain>/<slug>/` (see [`projects/`](projects/)).
- [ ] Root `README.md` **Project catalog** updated (row + counts if needed).
- [ ] System type and L1–L5 level are defensible and match the README [**Complexity levels**](README.md#complexity-levels) table.
- [ ] Tone is practical and engineering-oriented (see **What we want** / **What we avoid** above).

---

## Questions

If you are unsure whether an idea fits, open an issue with a **one-line summary**, **system type**, **level**, and **how it differs** from the closest existing catalog row. That is faster than a full write-up for a rejected duplicate.

Again: stay aligned with this document, the [**Project catalog**](README.md#project-catalog), and existing projects under [`projects/`](projects/) so maintainers can merge with minimal back-and-forth.
