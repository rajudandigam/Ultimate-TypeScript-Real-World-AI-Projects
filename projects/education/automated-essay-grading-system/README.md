System Type: Agent  
Complexity: Level 3  
Industry: Education  
Capabilities: Evaluation  

# Automated Essay Grading System

## 🧠 Overview
An **assessment agent** that scores **rubric dimensions** (thesis, evidence, organization, conventions) using **structured outputs** tied to **highlighted spans** in the student submission—**human override** is first-class; the system supports **blind second reads** and **bias monitoring**. It does **not** replace instructor judgment for high-stakes finals without institutional policy.

---

## 🎯 Problem
Manual grading scales poorly; naive model scores are **opaque**, **unfair**, or **gameable** by generic AI-written essays.

---

## 💡 Why This Matters
- **Pain it removes:** Grader fatigue, inconsistent rubrics, and slow feedback loops that hurt learning.
- **Who benefits:** Higher-ed and certification programs with large writing volumes and clear rubrics.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Per essay: `parse_submission`, `rubric_score`, `select_evidence_spans`, `draft_feedback`—all schema validated.

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 3. Rubric grounding + plagiarism/LLM-use heuristics (policy-dependent) + calibration; L4+ adds separate grader/reconciler agents and formal IRT calibration pipelines.

---

## 🏭 Industry
Example:
- Education / assessment technology

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — assignment prompt, exemplar essays (licensed)
- Planning — bounded (feedback structure)
- Reasoning — bounded (rationale per rubric cell)
- Automation — LMS grade passback (LIS/OneRoster/API)
- Decision making — bounded (score suggestions)
- Observability — **in scope**
- Personalization — instructor rubric variants
- Multimodal — handwritten uploads via OCR (accessibility + QA)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Next.js** instructor UI + **Node.js** BFF
- **OpenAI SDK** structured outputs
- **Postgres** for submissions, scores, audit
- **Canvas/Blackboard/Moodle** APIs where permitted
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Student upload or LMS attachment fetch (scoped).
- **LLM layer:** Agent emits `RubricScorecard` + `Feedback` JSON with span refs.
- **Tools / APIs:** LMS read/write (grades), similarity search (policy gated).
- **Memory (if any):** Rubric version store; calibration datasets (de-identified).
- **Output:** Scores + comments returned to LMS or export CSV.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Rubric checklist UI with human-only scoring; store results.

### Step 2: Add AI layer
- Model suggests comments; human must accept each dimension.

### Step 3: Add tools
- Pull assignment prompt + learning objectives into context automatically.

### Step 4: Add memory or context
- Active learning: instructor corrections retrain calibration layer (not raw student PII).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Dual-agent blind scoring + reconciliation workflow for high stakes.

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Agreement with human gold scores; quadratic weighted kappa per rubric row.
- **Latency:** p95 grading time per 1000 words under batch mode.
- **Cost:** Tokens per essay; OCR add-ons.
- **User satisfaction:** Student perception of fairness; instructor time saved.
- **Failure rate:** Rubric drift, demographic bias spikes, false plagiarism flags.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Feedback referencing nonexistent paragraphs; require span ids validated against parsed doc.
- **Tool failures:** LMS API errors; queue retries; never partial-grade without status flag.
- **Latency issues:** Long documents; hierarchical summarization before rubric pass.
- **Cost spikes:** Entire class regrade storms; batch scheduler + budgets.
- **Incorrect decisions:** Penalizing ESL style unfairly; dialect-aware guidelines and bias audits.

---

## 🏭 Production Considerations

- **Logging and tracing:** Store rubric version + model id; minimize raw essay retention per FERPA/policy.
- **Observability:** Override rates, inter-rater reliability vs AI, appeal counts.
- **Rate limiting:** Per institution; detect bot submissions.
- **Retry strategies:** Idempotent gradebook updates keyed by `(assignment_id, student_id, attempt)`.
- **Guardrails and validation:** Block harmful content escalation paths; accessibility of returned feedback HTML.
- **Security considerations:** FERPA/COPPA compliance, encryption, SSO, audit for grade changes.

---

## 🚀 Possible Extensions

- **Add UI:** Side-by-side rubric with evidence highlights for appeals.
- **Convert to SaaS:** Multi-tenant grading with institution-specific policies.
- **Add multi-agent collaboration:** “Content” vs “language mechanics” split scoring.
- **Add real-time capabilities:** Draft feedback during writing (formative mode—policy heavy).
- **Integrate with external systems:** Turnitin/similar products where licensed; Google Classroom.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **formative** low-stakes pilots before summative automation.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Rubric-grounded** assessment AI
  - **Fairness and appeals** workflow design
  - **LMS integration** realities
  - **System design thinking** for educational evaluation at scale
