# 📚 Project Index — Ultimate TypeScript Real World AI Projects

## 🔍 Purpose

This file is the **single registry** for catalog projects in this repository.

- **Avoid duplication:** Before starting or documenting a new system, scan the tables below to confirm the idea is not already covered.
- **Balance the catalog:** Use it to spot gaps across **domains** and **system types** (workflow vs agent vs multi-agent), so the collection stays useful rather than repetitive.
- **Navigate quickly:** Each row points to a folder containing `README.md` (full brief) and `architecture.md` (diagrams and engineering detail).

**Guide:** Repository principles live in `.cursor/guide.md` (there is no separate `CURSOR_GUIDE.md` in this repo).

---

## 📊 Summary

| Category | Count |
|---------|------:|
| Total Projects | 14 |
| Workflow / workflow-first | 4 |
| Agent | 6 |
| Multi-Agent | 4 |
| Level 5 (production-grade target) | 4 |

**How rows are counted:** Each project has one **primary** row in exactly one domain table. “Workflow / workflow-first” includes systems where a **durable workflow** is the spine (including hybrid **Workflow + Agent** designs). “Level 5” counts projects whose brief targets **Level 5** complexity.

---

## 🚀 Projects

Paths are repository-relative. Each path contains **`README.md`** and **`architecture.md`**.

---

### ✈️ Travel

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Travel Planner | Multi-Agent | L4 | Planning, RAG, Decision making, Personalization | `projects/travel/ai-travel-planner` |

---

### 🧑‍💻 DevTools

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Code Review Agent | Agent | L3 | Reasoning, Automation, Retrieval | `projects/devtools/ai-code-review-agent` |
| AI Cost Monitoring Engine | Workflow + Agent | L5 | Monitoring, Decision making, Optimization | `projects/devtools/ai-cost-monitoring-engine` |
| PR Risk Analyzer | Agent | L3 | Reasoning, Prediction, Retrieval | `projects/devtools/pr-risk-analyzer` |
| AI Workflow Builder | Workflow + Agent | L4 | Automation, Planning | `projects/devtools/ai-workflow-builder` |
| AI Debugging Assistant | Agent | L4 | Reasoning, Tool usage | `projects/devtools/ai-debugging-assistant` |

---

### ⚙️ Workflows

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Email to Task Workflow | Workflow | L2–L3 | Automation, Extraction, Decision making | `projects/workflows/email-to-task-workflow` |

---

### 🧭 Productivity

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Meeting Copilot | Agent | L3 | Summarization, Decision making, Memory | `projects/productivity/ai-meeting-copilot` |

---

### 🛠️ DevOps

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Agent Incident Response System | Multi-Agent | L5 | Planning, Automation, Decision making | `projects/devops/multi-agent-incident-response-system` |

---

### 💳 Fintech

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Expense Categorization + Insights | Workflow → Agent | L3 | Classification, Retrieval, Personalization | `projects/fintech/ai-expense-categorization-insights` |

---

### 🏢 Enterprise

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| RAG-based Internal Docs Assistant | Agent | L4 | Retrieval, Reasoning | `projects/enterprise/rag-internal-docs-assistant` |

---

### 🛒 E-commerce

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Agent Pricing Optimizer | Multi-Agent | L5 | Decision making, Optimization | `projects/ecommerce/multi-agent-pricing-optimizer` |

---

### 👥 HR

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Hiring Assistant | Agent | L3 | Reasoning, Matching | `projects/hr/ai-hiring-assistant` |

---

### 🔌 AI Infra

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| MCP Tool Registry System | Multi-Agent | L5 | Tooling, Orchestration | `projects/ai-infra/mcp-tool-registry-system` |

---

## 🧠 Future Ideas (Planned)

All ideas that previously lived only in this section are now **represented as catalog projects** in the tables above (same names and domains). Use this area for **new** candidates only—after checking the tables—and keep each row specific enough that it would not merge cleanly into an existing brief.

| Name | Domain | System Type | Complexity | Notes |
|------|--------|---------------|------------|-------|
| — | — | — | — | *No backlog rows right now.* |

---

## 🧭 Contribution Note

Before adding a new project:

1. **Check this file** and confirm the path/name is not already taken.
2. **Avoid duplication**—extend an existing `README.md` if the scope overlaps.
3. **Add new value**—prefer a distinct problem, integration surface, or production lesson.

**Naming:** keep titles **practical and specific**.

**Ideas:** favor **real-world** constraints—integrations, evaluation, cost, safety—over generic assistants with no clear architecture.

When you add a project:

- Create `projects/<domain>/<project-slug>/README.md` using `templates/project-template.md`.
- Add `architecture.md` with the sections used elsewhere in this repo (overview, ASCII diagram, components, data flow, agent interaction, scaling, failure handling, observability).
- Update **this index** (summary counts + the correct domain table) in the same change.
