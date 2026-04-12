# 📚 Project Index — Ultimate TypeScript Real World AI Projects

## 🔍 Purpose

This file is the **single registry** for catalog projects in this repository.

- **Avoid duplication:** Before starting or documenting a new system, scan the tables below (and the planned list) to confirm the idea is not already covered.
- **Balance the catalog:** Use it to spot gaps across **domains** (travel, DevTools, productivity, and so on) and across **system types** (workflow vs single agent vs multi-agent), so the collection stays useful rather than repetitive.
- **Navigate quickly:** Each row links to a concrete path where the project brief lives (or will live).

---

## 📊 Summary

| Category         | Count |
|-----------------|------:|
| Total Projects  |     4 |
| Workflows       |     1 |
| Agents          |     1 |
| Multi-Agent     |     1 |
| Production      |     1 |

---

## 🚀 Projects

Projects are grouped **by domain**. Paths are repository-relative; add a `README.md` inside each folder when the brief is written.

---

### ✈️ Travel

| Name               | System Type | Complexity | Capabilities                                               | Path                                   |
|--------------------|------------:|------------|------------------------------------------------------------|----------------------------------------|
| AI Travel Planner  | Multi-Agent | L4         | Planning, RAG, Decision-making, Personalization            | `projects/travel/ai-travel-planner`    |

---

### 🧑‍💻 DevTools

| Name                       | System Type | Complexity | Capabilities                                      | Path                                           |
|----------------------------|------------:|------------|---------------------------------------------------|------------------------------------------------|
| AI Code Review Agent       | Agent       | L3         | Reasoning, Automation, RAG                        | `projects/devtools/ai-code-review-agent`       |
| AI Cost Monitoring Engine  | Workflow    | L5         | Monitoring, Decision-making, Optimization         | `projects/devtools/ai-cost-monitoring-engine`  |

---

### ⚙️ Workflows / Productivity

| Name                  | System Type | Complexity | Capabilities                                    | Path                                        |
|-----------------------|------------:|------------|-------------------------------------------------|---------------------------------------------|
| Email to Task Workflow | Workflow   | L2         | Automation, Extraction, Decision-making         | `projects/workflows/email-to-task-workflow` |

---

## 🧠 Future Ideas (Planned)

This section tracks **high-value ideas** to implement next. It reduces duplicate briefs and keeps **strategic coverage** across domains and system types (workflow, agent, multi-agent, production depth).

| Name                                   | Domain       | System Type   | Complexity | Notes |
|----------------------------------------|-------------|---------------|------------|-------|
| PR Risk Analyzer                       | DevTools    | Agent         | L3         | Uses PR history and context to predict risk |
| AI Meeting Copilot                     | Productivity | Agent        | L3         | Agentic UI for meetings and action tracking |
| Multi-Agent Incident Response System   | DevOps      | Multi-Agent   | L5         | Automated incident triage and resolution planning |
| AI Expense Categorization + Insights | Fintech     | Workflow/Agent | L3       | Categorization + anomaly detection + insights |
| RAG-based Internal Docs Assistant      | Enterprise  | Agent         | L4         | Production-grade RAG with evaluation focus |
| AI Workflow Builder                    | DevTools    | Workflow/Agent | L4      | Generate workflows from natural language |
| Multi-Agent Pricing Optimizer          | E-commerce  | Multi-Agent   | L5         | Dynamic pricing using multiple agents |
| AI Hiring Assistant                    | HR          | Agent         | L3         | Resume analysis + interview insights |
| AI Debugging Assistant                 | DevTools    | Agent         | L4         | Uses logs and traces to suggest fixes |
| MCP Tool Registry System               | AI Infra    | Multi-Agent   | L5         | Tool discovery, permissions, agent interoperability |

---

## 🧭 Contribution Note

Before adding a new project:

1. **Check this file** and the **Future Ideas** table.
2. **Avoid duplication**—extend an existing brief if the scope overlaps.
3. **Add new value**—prefer a distinct problem, system shape, or production lesson over a renamed variant of the same idea.

**Naming:** keep titles **practical and specific** (who it serves, what artifact it produces, or what subsystem it models).

**Ideas:** favor **real-world** constraints—integrations, evaluation, cost, safety—over generic assistants with no clear architecture.
