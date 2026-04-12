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
| Total Projects | 220 |
| Workflow / workflow-first | 68 |
| Agent | 122 |
| Multi-Agent | 30 |
| Level 5 (production-grade target) | 40 |

**How rows are counted:** Each project has one **primary** row in exactly one domain table. “Workflow / workflow-first” includes systems where a **durable workflow** is the spine (including hybrid **Workflow + Agent** or **Workflow → Agent** designs). “Level 5” counts projects whose brief targets **Level 5** complexity.

---

## 🚀 Projects

Paths are repository-relative. Each path contains **`README.md`** and **`architecture.md`**.

---

### ✈️ Travel

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Travel Planner | Multi-Agent | L4 | Planning, RAG, Decision making, Personalization | `projects/travel/ai-travel-planner` |
| AI Trip Personalization Engine | Agent | L4 | Personalization, Retrieval | `projects/travel/ai-trip-personalization-engine` |
| Multi-Agent Travel Booking Optimizer | Multi-Agent | L5 | Decision making, Optimization | `projects/travel/multi-agent-travel-booking-optimizer` |
| AI Travel Cost Prediction System | Agent | L4 | Prediction, Analytics | `projects/travel/ai-travel-cost-prediction-system` |
| Travel Disruption Response System | Multi-Agent | L4 | Automation, Decision-making | `projects/travel/travel-disruption-response-system` |
| Corporate Travel Policy Enforcer | Agent | L4 | Validation, Decision-making | `projects/travel/corporate-travel-policy-enforcer` |
| Multi-Language Travel Concierge | Agent | L3 | Multilingual, Memory | `projects/travel/multi-language-travel-concierge` |
| Loyalty Program Optimizer | Agent | L2 | Optimization | `projects/travel/loyalty-program-optimizer` |
| Sustainable Travel Route Planner | Agent | L3 | Optimization, Analytics | `projects/travel/sustainable-travel-route-planner` |
| Hotel Review Sentiment Intelligence | Workflow | L2 | Sentiment Analysis | `projects/travel/hotel-review-sentiment-intelligence` |
| Travel Budget Assistant (Real-Time) | Agent | L2 | Tracking, Personalization | `projects/travel/travel-budget-assistant-real-time` |
| Group Travel Coordination Agent | Multi-Agent | L4 | Decision-making, Coordination | `projects/travel/group-travel-coordination-agent` |
| Dynamic Pricing Optimization Engine | Agent | L3 | Prediction, Optimization | `projects/travel/dynamic-pricing-optimization-engine` |

---

### 🍽️ Lifestyle

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Group Restaurant Decision Agent | Multi-Agent | L3 | Decision making, Coordination | `projects/lifestyle/group-restaurant-decision-agent` |
| Smart Hike Planning Agent | Agent | L3 | Planning, Retrieval | `projects/lifestyle/smart-hike-planning-agent` |
| Potluck Coordination Agent | Multi-Agent | L3 | Coordination, Planning | `projects/lifestyle/potluck-coordination-agent` |
| Event Catering Planning System | Agent | L3 | Planning, Optimization | `projects/lifestyle/event-catering-planning-system` |
| Weekend Activity Planner Agent | Agent | L3 | Recommendation, Planning | `projects/lifestyle/weekend-activity-planner-agent` |

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
| Automated Test Generation Agent | Agent | L3 | Generation | `projects/devtools/automated-test-generation-agent` |
| Bug Triage & Prioritization Agent | Agent | L3 | Classification | `projects/devtools/bug-triage-prioritization-agent` |
| Dependency Security Auditor | Workflow | L3 | Security | `projects/devtools/dependency-security-auditor` |
| Performance Regression Detector | Workflow | L3 | Monitoring | `projects/devtools/performance-regression-detector` |
| Infrastructure Cost Optimization Agent | Agent | L4 | Optimization | `projects/devtools/infrastructure-cost-optimization-agent` |
| API Design Validator | Agent | L2 | Validation | `projects/devtools/api-design-validator` |
| Codebase Complexity Analyzer | Workflow | L2 | Analysis | `projects/devtools/codebase-complexity-analyzer` |
| CI/CD Pipeline Optimization Agent | Agent | L3 | Optimization | `projects/devtools/cicd-pipeline-optimization-agent` |
| Smart Log Analysis Agent | Agent | L3 | Detection, Retrieval | `projects/devtools/smart-log-analysis-agent` |
| Long-Running Coding Agent (Task Decomposition Engine) | Agent | L4 | Planning | `projects/devtools/long-running-coding-task-decomposition-engine` |
| Codebase Migration Automation System | Workflow | L3 | Transformation | `projects/devtools/codebase-migration-automation-system` |
| REST API Orchestration Agent | Agent | L3 | Orchestration | `projects/devtools/rest-api-orchestration-agent` |
| Natural Language ↔ SQL Engine | Workflow | L2 | Translation | `projects/devtools/natural-language-sql-engine` |
| IDE Code Completion Agent (Copilot Alternative) | Agent | L3 | Generation | `projects/devtools/ide-code-completion-agent` |
| Real-Time Conversation Memory System | Workflow | L2 | Memory | `projects/devtools/real-time-conversation-memory-system` |

---

### 🤖 Agentic UI

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI In-App Product Copilot | Agent | L4 | Assistance, Context Awareness | `projects/agentic-ui/ai-in-app-product-copilot` |
| AI Form Filling Assistant | Agent | L3 | Automation | `projects/agentic-ui/ai-form-filling-assistant` |

---

### 🧩 Platform

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Agentic Workflow Builder (n8n-style AI Platform) | Multi-Agent | L4 | Orchestration, Automation | `projects/platform/agentic-workflow-builder-platform` |
| Cross-Platform Computer Use Automation System | Agent | L4 | Automation, Tool usage | `projects/platform/cross-platform-computer-use-automation-system` |
| Collaborative Multi-Agent Workspace Platform | Multi-Agent | L4 | Collaboration, Orchestration | `projects/platform/collaborative-multi-agent-workspace-platform` |

---

### 🎨 Frontend

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Generative UI Component System | Agent | L3 | Generation, Personalization | `projects/frontend/generative-ui-component-system` |

---

### ⚙️ Workflows

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Email to Task Workflow | Workflow | L2–L3 | Automation, Extraction, Decision making | `projects/workflows/email-to-task-workflow` |
| AI Document Processing Pipeline | Workflow | L3 | Extraction, Automation | `projects/workflows/ai-document-processing-pipeline` |
| AI Email Automation Engine | Workflow → Agent | L3 | Automation | `projects/workflows/ai-email-automation-engine` |
| AI Customer Support Ticket Router | Workflow | L3 | Classification | `projects/workflows/ai-customer-support-ticket-router` |

---

### 🧭 Productivity

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Meeting Copilot | Agent | L3 | Summarization, Decision making, Memory | `projects/productivity/ai-meeting-copilot` |
| Meeting Notes → Action Workflow | Workflow | L2–L3 | Extraction, Automation | `projects/productivity/meeting-notes-action-workflow` |
| AI Spreadsheet Copilot | Agent | L4 | Analysis | `projects/productivity/ai-spreadsheet-copilot` |
| Smart Calendar Scheduling Agent | Agent | L3 | Optimization | `projects/productivity/smart-calendar-scheduling-agent` |
| Intelligent Email Drafting Assistant | Agent | L2 | Generation | `projects/productivity/intelligent-email-drafting-assistant` |
| Project Status Aggregation System | Workflow | L2 | Aggregation | `projects/productivity/project-status-aggregation-system` |
| Focus Time Protection Agent | Agent | L2 | Automation | `projects/productivity/focus-time-protection-agent` |
| Team Workload Optimization Agent | Agent | L3 | Optimization | `projects/productivity/team-workload-optimization-agent` |
| Slack/Teams Intelligent Summarization System | Workflow | L2 | Summarization, Automation | `projects/productivity/slack-teams-intelligent-summarization-system` |
| Freelancer Workday Optimization Agent | Agent | L3 | Planning, Prediction | `projects/productivity/freelancer-workday-optimization-agent` |

---

### 🎧 Support

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Channel Support Routing Agent | Agent | L3 | Routing | `projects/support/multi-channel-support-routing-agent` |
| Knowledge Base Auto-Curation System | Workflow | L2 | Generation | `projects/support/knowledge-base-auto-curation-system` |
| SLA Compliance Monitoring System | Workflow | L2 | Monitoring | `projects/support/sla-compliance-monitoring-system` |
| Customer Journey Intelligence Agent | Agent | L3 | Prediction | `projects/support/customer-journey-intelligence-agent` |
| Automated Refund Decision Engine | Workflow | L2 | Decision-making | `projects/support/automated-refund-decision-engine` |

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
| Real-Time Fraud Detection Workflow | Workflow | L2 | Detection | `projects/fintech/real-time-fraud-detection-workflow` |
| KYC Document Processing System | Workflow | L3 | OCR, Validation | `projects/fintech/kyc-document-processing-system` |
| Personalized Investment Advisor Agent | Agent | L4 | Planning, Prediction | `projects/fintech/personalized-investment-advisor-agent` |
| Expense Report Automation System | Workflow | L2 | Automation | `projects/fintech/expense-report-automation-system` |
| Credit Risk Assessment Agent | Agent | L4 | Risk Analysis | `projects/fintech/credit-risk-assessment-agent` |
| Algorithmic Trading Strategy Validator | Multi-Agent | L5 | Simulation, Optimization | `projects/fintech/algorithmic-trading-strategy-validator` |
| AML Investigation Multi-Agent System | Multi-Agent | L5 | Detection, Analysis | `projects/fintech/aml-investigation-multi-agent-system` |
| Intelligent Payment Routing Agent | Agent | L3 | Optimization | `projects/fintech/intelligent-payment-routing-agent` |
| Financial Document Q&A System | Agent | L3 | Retrieval, Reasoning | `projects/fintech/financial-document-qa-system` |
| Regulatory Compliance Monitor | Workflow | L3 | Monitoring, Validation | `projects/fintech/regulatory-compliance-monitor` |
| Personal Budget Assistant | Agent | L2 | Personalization, Analytics | `projects/fintech/personal-budget-assistant` |
| Invoice Processing & Reconciliation System | Workflow | L2 | Extraction, Matching | `projects/fintech/invoice-processing-reconciliation-system` |
| FinGPT Financial Intelligence Agent | Agent | L4 | Prediction, Sentiment | `projects/fintech/fingpt-financial-intelligence-agent` |
| Reinforcement Learning Trading Agent | Agent | L5 | Learning, Optimization | `projects/fintech/reinforcement-learning-trading-agent` |
| Cryptocurrency Portfolio Manager | Agent | L3 | Optimization, Tracking | `projects/fintech/cryptocurrency-portfolio-manager` |

---

### 🏥 Healthcare

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Patient Intake Automation System | Workflow | L2 | Extraction, Automation | `projects/healthcare/patient-intake-automation-system` |
| Medical Imaging Analysis Assistant | Agent | L4 | Computer vision, Detection | `projects/healthcare/medical-imaging-analysis-assistant` |
| Clinical Trial Matching Agent | Agent | L3 | Matching, Retrieval | `projects/healthcare/clinical-trial-matching-agent` |
| Drug Interaction Checker | Workflow | L2 | Validation | `projects/healthcare/drug-interaction-checker` |
| Medical Coding & Billing Assistant | Workflow | L3 | Classification | `projects/healthcare/medical-coding-billing-assistant` |
| Mental Health Support Agent | Agent | L3 | Conversational, Monitoring | `projects/healthcare/mental-health-support-agent` |
| Hospital Resource Optimization System | Multi-Agent | L5 | Optimization, Planning | `projects/healthcare/hospital-resource-optimization-system` |
| Medication Adherence Monitoring System | Workflow | L2 | Monitoring | `projects/healthcare/medication-adherence-monitoring-system` |
| Health Data Interoperability (FHIR Agent System) | Agent | L4 | Integration | `projects/healthcare/health-data-interoperability-fhir-agent-system` |
| Clinical Note Generation Agent | Agent | L3 | Generation, Speech | `projects/healthcare/clinical-note-generation-agent` |
| Clinical Decision Support System | Agent | L4 | Reasoning, Retrieval | `projects/healthcare/clinical-decision-support-system` |
| Remote Patient Monitoring Intelligence Agent | Agent | L3 | Monitoring, Prediction | `projects/healthcare/remote-patient-monitoring-intelligence-agent` |

---

### 🧾 Finance

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Invoice Processing Pipeline | Workflow | L3 | Extraction, Classification | `projects/finance/invoice-processing-pipeline` |

---

### ⚖️ Legal

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Regulatory Change Impact Analyzer | Workflow | L3 | Monitoring | `projects/legal/regulatory-change-impact-analyzer` |
| Contract Clause Extraction System | Workflow | L2 | Extraction | `projects/legal/contract-clause-extraction-system` |
| Privacy Impact Assessment Agent | Agent | L3 | Compliance | `projects/legal/privacy-impact-assessment-agent` |
| Litigation Risk Prediction Agent | Agent | L4 | Prediction | `projects/legal/litigation-risk-prediction-agent` |
| Due Diligence Multi-Agent System | Multi-Agent | L4 | Research, Reasoning | `projects/legal/due-diligence-multi-agent-system` |

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
| AI Personalized Learning Path Generator | Agent | L4 | Planning, Personalization | `projects/education/ai-personalized-learning-path-generator` |
| AI Homework Assistant with Reasoning | Agent | L3 | Reasoning | `projects/education/ai-homework-assistant-with-reasoning` |
| Multi-Agent Tutoring System | Multi-Agent | L5 | Teaching, Adaptation | `projects/education/multi-agent-tutoring-system` |
| Automated Essay Grading System | Agent | L3 | Evaluation | `projects/education/automated-essay-grading-system` |
| Student Engagement Prediction System | Workflow | L2 | Prediction | `projects/education/student-engagement-prediction-system` |
| Automated Question Generation Agent | Agent | L2 | Generation | `projects/education/automated-question-generation-agent` |
| Peer Learning Group Matcher | Agent | L2 | Matching | `projects/education/peer-learning-group-matcher` |

---

### 🧑‍🤝‍🧑 Personal AI

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Personal AI Life Assistant | Agent | L5 | Memory, Planning | `projects/personal-ai/personal-ai-life-assistant` |
| AI Habit Tracking + Coaching System | Agent | L4 | Monitoring, Feedback | `projects/personal-ai/ai-habit-tracking-coaching-system` |
| AI Daily Planner with Memory | Workflow → Agent | L4 | Planning, Memory | `projects/personal-ai/ai-daily-planner-with-memory` |
| Weekly Grocery Optimization Agent | Agent | L3 | Optimization, Personalization | `projects/personal-ai/weekly-grocery-optimization-agent` |
| Home Maintenance Intelligence System | Agent | L3 | Prediction, Planning | `projects/personal-ai/home-maintenance-intelligence-system` |
| Bill Splitting & Fairness Optimization Agent | Agent | L3 | Optimization, Decision making | `projects/personal-ai/bill-splitting-fairness-optimization-agent` |

---

### 👨‍👩‍👧 Family

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| School Morning Routine Planner | Agent | L2 | Planning, Automation | `projects/family/school-morning-routine-planner` |
| Kids Activity & Learning Planner Agent | Agent | L3 | Personalization, Planning | `projects/family/kids-activity-learning-planner-agent` |

---

### 🔐 Security

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Phishing Detection System | Agent | L4 | Classification, Detection | `projects/security/ai-phishing-detection-system` |
| AI Threat Intelligence Aggregator | Agent | L5 | Retrieval, Analysis | `projects/security/ai-threat-intelligence-aggregator` |
| Multi-Agent Cyber Defense System | Multi-Agent | L5 | Detection, Response | `projects/security/multi-agent-cyber-defense-system` |
| AI Content Moderation Engine | Workflow → Agent | L4 | Classification | `projects/security/ai-content-moderation-engine` |
| AI Identity Verification System | Workflow | L4 | Verification | `projects/security/ai-identity-verification-system` |
| Security Vulnerability Scanner System | Workflow | L3 | Detection, Automation | `projects/security/security-vulnerability-scanner-system` |
| Threat Intelligence Aggregation Platform | Multi-Agent | L4 | Monitoring, Retrieval | `projects/security/threat-intelligence-aggregation-platform` |
| System-Wide Anomaly Detection Engine | Workflow | L3 | Detection, Monitoring | `projects/security/system-wide-anomaly-detection-engine` |
| Incident Triage & Automated Response System | Multi-Agent | L4 | Orchestration, Automation | `projects/security/incident-triage-automated-response-system` |
| Compliance Audit Automation Platform | Workflow | L3 | Compliance, Automation | `projects/security/compliance-audit-automation-platform` |
| Autonomous Penetration Testing Agents (PentAGI) | Multi-Agent | L5 | Simulation, Automation | `projects/security/autonomous-penetration-testing-agents-pentagi` |
| Continuous Security Posture Assessment Agent | Agent | L3 | Monitoring, Reasoning | `projects/security/continuous-security-posture-assessment-agent` |
| Data Loss Prevention (DLP) Intelligence Agent | Agent | L3 | Detection, Reasoning | `projects/security/dlp-intelligence-agent` |

---

### 🌐 Web3

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Smart Contract Auditor | Agent | L5 | Analysis, Security | `projects/web3/ai-smart-contract-auditor` |
| AI DAO Governance Assistant | Agent | L4 | Decision-making | `projects/web3/ai-dao-governance-assistant` |

---

### 🏭 IoT

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Smart Home Automation Agent | Agent | L4 | Automation | `projects/iot/ai-smart-home-automation-agent` |
| Multi-Agent Smart City Traffic System | Multi-Agent | L5 | Optimization | `projects/iot/multi-agent-smart-city-traffic-system` |
| IoT Fleet Intelligence Management Agent | Agent | L3 | Monitoring, Reasoning | `projects/iot/iot-fleet-intelligence-management-agent` |

---

### 🎮 Gaming

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI NPC Behavior Engine | Agent | L4 | Reasoning | `projects/gaming/ai-npc-behavior-engine` |
| Multi-Agent Game Strategy Simulator | Multi-Agent | L5 | Strategy, Simulation | `projects/gaming/multi-agent-game-strategy-simulator` |

---

### 🎤 Voice

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Real-Time Voice AI Assistant | Agent | L5 | Speech, Reasoning | `projects/voice/real-time-voice-ai-assistant` |
| AI Call Center Automation System | Workflow → Agent | L5 | Automation | `projects/voice/ai-call-center-automation-system` |

---

### 🎙️ AI Interface

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Voice-First AI Interaction System | Agent | L3 | Interaction, Automation | `projects/ai-interface/voice-first-ai-interaction-system` |

---

### 📣 Marketing

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Agent Marketing Campaign System | Multi-Agent | L4 | Planning, Content Generation | `projects/marketing/multi-agent-marketing-campaign-system` |
| Lead Scoring & Qualification Agent | Agent | L3 | Prediction, Personalization | `projects/marketing/lead-scoring-qualification-agent` |
| Personalized Email Campaign Generator | Agent | L3 | Generation, Personalization | `projects/marketing/personalized-email-campaign-generator` |
| Ad Creative Optimization Agent | Agent | L3 | Optimization, Generation | `projects/marketing/ad-creative-optimization-agent` |
| Content Marketing Strategy Agent | Agent | L3 | Planning, Retrieval | `projects/marketing/content-marketing-strategy-agent` |
| Sales Forecasting Intelligence System | Agent | L3 | Prediction, Analytics | `projects/marketing/sales-forecasting-intelligence-system` |
| Competitive Intelligence Monitoring Agent | Agent | L3 | Monitoring, Retrieval | `projects/marketing/competitive-intelligence-monitoring-agent` |
| Social Media Content Automation Agent | Agent | L2 | Generation, Personalization | `projects/marketing/social-media-content-automation-agent` |

---

### 📰 Media

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI News Personalization Engine | Agent | L3 | Personalization | `projects/media/ai-news-personalization-engine` |
| Automated Video Editing Agent | Agent | L3 | Multimodal, Generation | `projects/media/automated-video-editing-agent` |
| Podcast Insight Extraction Agent | Agent | L2 | Extraction, Summarization | `projects/media/podcast-insight-extraction-agent` |
| Plagiarism & Copyright Detection System | Workflow | L2 | Detection, Monitoring | `projects/media/plagiarism-copyright-detection-system` |
| Automated Subtitle Generation System | Workflow | L2 | Multimodal, Automation | `projects/media/automated-subtitle-generation-system` |
| Content Performance Prediction Agent | Agent | L3 | Prediction, Analytics | `projects/media/content-performance-prediction-agent` |

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
| AI CRM Copilot (Sales Assistant) | Agent | L4 | Decision-making, Retrieval | `projects/enterprise/ai-crm-copilot-sales-assistant` |
| AI Business Strategy Simulator | Multi-Agent | L5 | Simulation, Decision-making | `projects/enterprise/ai-business-strategy-simulator` |
| AI Scenario Planning Engine | Agent | L4 | Prediction | `projects/enterprise/ai-scenario-planning-engine` |

---

### 🏢 Enterprise AI

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Enterprise RAG Knowledge Platform (Permission-Aware) | Agent | L4 | Retrieval, Reasoning | `projects/enterprise-ai/enterprise-rag-knowledge-platform` |

---

### 🛒 E-commerce

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Agent Pricing Optimizer | Multi-Agent | L5 | Decision making, Optimization | `projects/ecommerce/multi-agent-pricing-optimizer` |
| AI Pricing Experimentation Platform | Agent | L4 | Experimentation | `projects/ecommerce/ai-pricing-experimentation-platform` |
| AI Shopping Assistant (Conversational Commerce) | Agent | L4 | Recommendation | `projects/ecommerce/ai-shopping-assistant-conversational-commerce` |
| Visual Search & Style Matching Engine | Agent | L3 | Multimodal, Retrieval | `projects/ecommerce/visual-search-style-matching-engine` |
| Smart Cart Optimization Agent | Agent | L2 | Recommendation | `projects/ecommerce/smart-cart-optimization-agent` |
| Size & Fit Recommendation Agent | Agent | L3 | Prediction | `projects/ecommerce/size-fit-recommendation-agent` |
| Competitive Price Monitoring System | Workflow | L2 | Monitoring | `projects/ecommerce/competitive-price-monitoring-system` |
| Return Fraud Detection System | Workflow | L3 | Detection | `projects/ecommerce/return-fraud-detection-system` |
| Multi-Channel Inventory Sync System | Workflow | L2 | Synchronization | `projects/ecommerce/multi-channel-inventory-sync-system` |
| Abandoned Cart Recovery Agent | Agent | L2 | Personalization | `projects/ecommerce/abandoned-cart-recovery-agent` |

---

### 🚚 Logistics

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Supply Chain Optimization System | Multi-Agent | L5 | Optimization | `projects/logistics/ai-supply-chain-optimization-system` |
| Demand Forecasting Agent | Agent | L3 | Prediction, Analytics | `projects/logistics/demand-forecasting-agent` |
| Delivery Route Optimization Agent | Agent | L3 | Optimization, Planning | `projects/logistics/delivery-route-optimization-agent` |
| Supplier Risk Monitoring System | Workflow | L3 | Monitoring, Risk analysis | `projects/logistics/supplier-risk-monitoring-system` |
| Warehouse Layout Optimization Agent | Agent | L3 | Optimization, Simulation | `projects/logistics/warehouse-layout-optimization-agent` |
| Shipment Tracking Intelligence System | Workflow | L2 | Monitoring, Detection | `projects/logistics/shipment-tracking-intelligence-system` |
| Inventory Replenishment Automation Agent | Agent | L3 | Automation, Optimization | `projects/logistics/inventory-replenishment-automation-agent` |

---

### 🏠 Real Estate

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Property Valuation Intelligence Agent | Agent | L3 | Prediction, Analytics | `projects/real-estate/property-valuation-intelligence-agent` |
| Smart Property Matching System | Agent | L3 | Matching, Retrieval | `projects/real-estate/smart-property-matching-system` |
| Lease Agreement Analysis Agent | Agent | L2 | Extraction, Risk analysis | `projects/real-estate/lease-agreement-analysis-agent` |
| Maintenance Request Automation System | Workflow | L2 | Automation, Routing | `projects/real-estate/maintenance-request-automation-system` |
| Real Estate Investment Analyzer | Agent | L3 | Financial analysis, Prediction | `projects/real-estate/real-estate-investment-analyzer` |

---

### 👥 HR

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| AI Hiring Assistant | Agent | L3 | Reasoning, Matching | `projects/hr/ai-hiring-assistant` |
| AI Resume Parsing + Ranking System | Workflow → Agent | L3 | Extraction, Ranking | `projects/hr/ai-resume-parsing-ranking-system` |
| Resume Screening & Ranking System | Workflow | L2 | Matching, Ranking | `projects/hr/resume-screening-ranking-system` |
| Interview Question Generation Agent | Agent | L2 | Generation | `projects/hr/interview-question-generation-agent` |
| Candidate Sourcing Agent | Agent | L3 | Retrieval, Matching | `projects/hr/candidate-sourcing-agent` |
| Employee Onboarding Automation System | Workflow | L2 | Automation, Orchestration | `projects/hr/employee-onboarding-automation-system` |
| Performance Review Intelligence Agent | Agent | L3 | Analysis, Planning | `projects/hr/performance-review-intelligence-agent` |
| Employee Sentiment Monitoring System | Workflow | L2 | Monitoring, Prediction | `projects/hr/employee-sentiment-monitoring-system` |

---

### 🧠 AI Core

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Multi-Modal Intelligence Agent | Agent | L4 | Multimodal, Reasoning | `projects/ai-core/multi-modal-intelligence-agent` |
| Autonomous Research Multi-Agent System | Multi-Agent | L4 | Research, Retrieval | `projects/ai-core/autonomous-research-multi-agent-system` |

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
| Domain-Specific RAG Builder (Plug & Play) | Workflow | L4 | Retrieval | `projects/ai-infra/domain-specific-rag-builder` |
| RAG Query Rewriting Engine | Agent | L4 | Optimization | `projects/ai-infra/rag-query-rewriting-engine` |
| Hybrid Search Engine (Vector + Keyword) | Workflow | L4 | Retrieval | `projects/ai-infra/hybrid-search-engine` |
| AI Knowledge Graph + RAG System | Agent | L5 | Reasoning, Retrieval | `projects/ai-infra/ai-knowledge-graph-rag-system` |
| AI Workflow Testing & Evaluation Framework | Workflow | L3 | Testing, Observability | `projects/ai-infra/ai-workflow-testing-evaluation-framework` |

*Note:* A separately named “**MCP Tool Registry & Discovery System**” is intentionally **not** a second catalog row—it overlaps the existing **MCP Tool Registry System** (registry + discovery + permissions). Extend that brief if you need more detail.

*Note:* The candidate **“MCP Server Hub & Registry Platform”** is treated as the same catalog surface area as **MCP Tool Registry System**—use that project and extend it rather than adding a duplicate row.

---

### 🌱 Sustainability

| Name | System Type | Complexity | Capabilities | Path |
|------|-------------|------------|--------------|------|
| Climate & Sustainability Intelligence Agent | Agent | L3 | Analytics, Planning | `projects/sustainability/climate-sustainability-intelligence-agent` |

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
