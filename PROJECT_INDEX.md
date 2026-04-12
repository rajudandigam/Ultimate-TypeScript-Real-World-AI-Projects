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
| Total Projects | 43 |
| Workflow / workflow-first | 19 |
| Agent | 15 |
| Multi-Agent | 9 |
| Level 5 (production-grade target) | 22 |

**How rows are counted:** Each project has one **primary** row in exactly one domain table. “Workflow / workflow-first” includes systems where a **durable workflow** is the spine (including hybrid **Workflow + Agent** or **Workflow → Agent** designs). “Level 5” counts projects whose brief targets **Level 5** complexity.

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
| AI CI Failure Analyzer | Agent | L3 | Reasoning, Retrieval, Debugging | `projects/devtools/ai-ci-failure-analyzer` |
| AI Test Case Generator | Workflow → Agent | L3 | Generation, Reasoning | `projects/devtools/ai-test-case-generator` |
| AI API Contract Validator | Agent | L3 | Validation, Reasoning | `projects/devtools/ai-api-contract-validator` |

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
| Meeting Notes → Action Workflow | Workflow | L2–L3 | Extraction, Automation | `projects/productivity/meeting-notes-action-workflow` |

---

### 🛠️ DevOps

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Agent Incident Response System | Multi-Agent | L5 | Planning, Automation, Decision making | `projects/devops/multi-agent-incident-response-system` |
| Multi-Agent DevOps Assistant | Multi-Agent | L5 | Automation, Decision making | `projects/devops/multi-agent-devops-assistant` |

---

### 💳 Fintech

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Expense Categorization + Insights | Workflow → Agent | L3 | Classification, Retrieval, Personalization | `projects/fintech/ai-expense-categorization-insights` |

---

### 🧾 Finance

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Invoice Processing Pipeline | Workflow | L3 | Extraction, Classification | `projects/finance/invoice-processing-pipeline` |

---

### 💼 Sales

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Sales Assistant | Agent | L3 | Personalization, Decision making | `projects/sales/ai-sales-assistant` |

---

### 🎓 Education

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Learning Tutor | Agent | L3 | Personalization, Reasoning | `projects/education/ai-learning-tutor` |

---

### 📣 Marketing

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Agent Marketing Campaign System | Multi-Agent | L4 | Planning, Content Generation | `projects/marketing/multi-agent-marketing-campaign-system` |

---

### 📈 Analytics

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Analytics Query Assistant | Agent | L4 | Retrieval, Query Generation | `projects/analytics/ai-analytics-query-assistant` |

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
| AI Agent Orchestration Engine | Multi-Agent | L5 | Orchestration, Planning | `projects/ai-infra/ai-agent-orchestration-engine` |
| AI Agent Memory Management System | Workflow → Agent | L5 | Memory, Retrieval | `projects/ai-infra/ai-agent-memory-management-system` |
| AI Prompt Optimization Engine | Agent | L4 | Optimization, Evaluation | `projects/ai-infra/ai-prompt-optimization-engine` |
| AI Evaluation Framework (LLM Testing System) | Workflow | L5 | Evaluation, Benchmarking | `projects/ai-infra/ai-evaluation-framework` |
| AI Output Quality Scoring Engine | Agent | L5 | Evaluation, Reasoning | `projects/ai-infra/ai-output-quality-scoring-engine` |
| AI Observability Platform (Tracing + Logs) | Workflow | L5 | Monitoring, Logging | `projects/ai-infra/ai-observability-platform` |
| AI Feedback Loop System (Human-in-the-loop) | Workflow → Agent | L5 | Learning, Feedback | `projects/ai-infra/ai-feedback-loop-system` |
| AI Guardrails & Safety Engine | Workflow → Agent | L5 | Validation, Safety | `projects/ai-infra/ai-guardrails-safety-engine` |
| AI Hallucination Detection System | Agent | L5 | Detection, Reasoning | `projects/ai-infra/ai-hallucination-detection-system` |
| AI Retry & Fallback Strategy Engine | Workflow | L5 | Reliability, Optimization | `projects/ai-infra/ai-retry-fallback-strategy-engine` |
| AI Token Usage Optimization Engine | Workflow → Agent | L5 | Optimization, Monitoring | `projects/ai-infra/ai-token-usage-optimization-engine` |
| AI Latency Optimization System | Workflow | L5 | Performance | `projects/ai-infra/ai-latency-optimization-system` |
| Cross-Agent Communication Protocol System | Multi-Agent | L5 | Communication, Orchestration | `projects/ai-infra/cross-agent-communication-protocol-system` |
| AI Tool Permissioning System | Workflow | L5 | Security, Control | `projects/ai-infra/ai-tool-permissioning-system` |
| Multi-Source RAG Aggregation Engine | Agent | L5 | Retrieval, Aggregation | `projects/ai-infra/multi-source-rag-aggregation-engine` |
| Context Window Optimization System | Workflow | L4 | Optimization | `projects/ai-infra/context-window-optimization-system` |
| Real-Time AI Streaming Response Engine | Workflow | L5 | Streaming, Performance | `projects/ai-infra/real-time-ai-streaming-response-engine` |
| AI Event-Driven Workflow Engine | Workflow | L5 | Automation, Event Processing | `projects/ai-infra/ai-event-driven-workflow-engine` |
| AI System Self-Improvement Engine | Multi-Agent | L5 | Learning, Optimization | `projects/ai-infra/ai-system-self-improvement-engine` |

*Note:* A separately named “**MCP Tool Registry & Discovery System**” is intentionally **not** a second catalog row—it overlaps the existing **MCP Tool Registry System** (registry + discovery + permissions). Extend that brief if you need more detail.

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
