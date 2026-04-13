# Contributing

Thank you for helping improve this catalog. The goal is **high-signal, production-minded system designs** in **TypeScript**, not a longer list of generic assistants.

---

## Before you open a PR

1. Read [`.cursor/guide.md`](.cursor/guide.md) — quality bar, categorization, and tone.
2. Search [`PROJECT_INDEX.md`](PROJECT_INDEX.md) for similar names and problems. **Avoid duplicates** and near-duplicates (renamed chatbots).
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
- Overhyped language (see guide for examples).

---

## Adding or updating a catalog project

### 1. Location

Use a domain folder under `projects/` that matches the problem (examples: `devtools`, `travel`, `enterprise-ai`, `security`). Path shape:

```text
projects/<domain>/<project-slug>/
  README.md
  architecture.md
```

Use **kebab-case** slugs. If no domain fits, pick the closest industry bucket rather than inventing many new top-level domains.

### 2. `README.md`

Use [`templates/project-template.md`](templates/project-template.md) as a **checklist**. Every brief should make it obvious:

- **Problem** and **why it matters**
- **System type** (workflow, single agent, multi-agent) and **why**
- **Complexity** (L1–L5): use [`.cursor/guide.md`](.cursor/guide.md) for definitions and stay **consistent** with how similar systems are tagged in [`PROJECT_INDEX.md`](PROJECT_INDEX.md)
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

Add **exactly one** primary row to the correct domain table in [`PROJECT_INDEX.md`](PROJECT_INDEX.md):

- **Name**, **System Type**, **Complexity**, **Capabilities**, **Path** (directory only, no trailing slash)
- Update **summary counts** at the top if totals change (see the note in the index on how rows are counted).

Do not list the same conceptual project twice under different domains unless the **system behavior** is genuinely different (rare).

---

## PR checklist

- [ ] Checked `PROJECT_INDEX.md` for duplicates.
- [ ] `README.md` + `architecture.md` present under `projects/<domain>/<slug>/`.
- [ ] `PROJECT_INDEX.md` updated (row + counts if needed).
- [ ] System type and L1–L5 level are defensible and match guide definitions.
- [ ] Tone matches guide (practical, not hypey).

---

## Questions

If you are unsure whether an idea fits, open an issue with a **one-line summary**, **system type**, **level**, and **how it differs** from the closest existing index row. That is faster than a full write-up for a rejected duplicate.

Again: [`.cursor/guide.md`](.cursor/guide.md) is the source of truth for structure and philosophy. Align with it and the maintainers can merge with minimal back-and-forth.
