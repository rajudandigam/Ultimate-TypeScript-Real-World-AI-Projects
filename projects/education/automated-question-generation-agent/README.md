System Type: Agent  
Complexity: Level 2  
Industry: Education  
Capabilities: Generation  

# Automated Question Generation Agent

## 🧠 Overview
A **content agent** that generates **quiz items** (MCQ, short answer, cloze) from **instructor-provided source text** or **learning objectives**—every item includes **answer key**, **distractor rationale**, and **difficulty tag** in **structured JSON** validated before export to **LMS QTI** or your assessment bank. **Academic integrity**: block generation during **proctored exam windows** via policy flags.

---

## 🎯 Problem
Writing quality assessments is slow; poor distractors make exams **non-discriminatory** or **ambiguous**.

---

## 💡 Why This Matters
- **Pain it removes:** Instructor time spent on item writing, inconsistent difficulty, and thin question banks.
- **Who benefits:** Curriculum teams and instructors building formative quizzes at scale.

---

## 🏗️ System Type
- Workflow / Single Agent / Multi-Agent System

**Chosen:** Single Agent (tool-using)

Tools: `fetch_objectives`, `chunk_source`, `generate_items`, `validate_schema`, `check_duplicate` (embedding similarity against bank).

---

## ⚙️ Complexity Level
- Level 1 → Prompt + API
- Level 2 → Tool usage
- Level 3 → Memory + RAG
- Level 4 → Multi-agent orchestration
- Level 5 → Production-grade system

**Target:** Level 2. Schema-bound generation + dedupe + export; L3+ adds learning-objective alignment graphs and adaptive testing parameters.

---

## 🏭 Industry
Example:
- Education / instructional design tooling

---

## 🧩 Capabilities
Select relevant ones:

- Retrieval (RAG) — textbook excerpts, instructor notes (licensed)
- Planning — bounded (blueprint: N easy/M medium/K hard)
- Reasoning — bounded (distractor design rationale)
- Automation — LMS export pipelines
- Decision making — bounded (duplicate/near-duplicate rejection)
- Observability — **in scope**
- Personalization — per-course style and banned topics lists
- Multimodal — diagrams → questions (careful copyright)

---

## 🛠️ Suggested TypeScript Stack
Examples:

- **Node.js + TypeScript** API
- **OpenAI SDK** structured outputs
- **Postgres + pgvector** for item bank dedupe
- **Canvas QTI**/**Moodle XML** exporters
- **OpenTelemetry**

---

## 🧱 High-Level Architecture
Describe the main components:

- **Input (UI / API / CLI):** Source PDF/text, blueprint counts, taxonomy tags.
- **LLM layer:** Agent emits `Item[]` JSON with explanations.
- **Tools / APIs:** Rights-checked document store; similarity search against bank.
- **Memory (if any):** Course item bank; prior accepted items as style anchors.
- **Output:** JSON + packaged QTI zip + human review queue.

---

## 🔄 Implementation Steps

### Step 1: Basic version
- Template MCQs from bullet list (no LLM).

### Step 2: Add AI layer
- LLM generates items from a single pasted chapter with citations to paragraph ids.

### Step 3: Add tools
- Dedupe against bank; validate only one correct MCQ key.

### Step 4: Add memory or context
- Instructor edits become few-shot exemplars for the course (permissioned).

### Step 5: Upgrade to agent or multi-agent (if applicable)
- Separate **factuality** checker pass with read-only tools (optional).

---

## 📊 Evaluation
How do you measure if this system works?

- **Accuracy:** Item review pass rate; psychometrics after pilot (difficulty/discrimination).
- **Latency:** Items per minute for a typical chapter blueprint.
- **Cost:** Tokens per item; embedding dedupe cost.
- **User satisfaction:** Instructor NPS; student clarity complaints.
- **Failure rate:** Ambiguous stems, leaked answers, copyright-violating paraphrases.

---

## ⚠️ Challenges & Failure Cases

- **Hallucinations:** Facts not in source; require citation spans or refuse item.
- **Tool failures:** OCR errors; route to human cleanup queue.
- **Latency issues:** Large PDFs; preprocess into paragraph index offline.
- **Cost spikes:** Regenerate loops; cap attempts per item slot.
- **Incorrect decisions:** Near-duplicate accepted; tune similarity thresholds per subject.

---

## 🏭 Production Considerations

- **Logging and tracing:** Item ids, model versions, source doc version hashes.
- **Observability:** Rejection reasons taxonomy, export success rate, review backlog age.
- **Rate limiting:** Per instructor and per course; detect scraping of copyrighted texts.
- **Retry strategies:** Idempotent export jobs to LMS with external id mapping.
- **Guardrails and validation:** Block disallowed topics; accessibility checks for images/alt text.
- **Security considerations:** Copyright compliance, FERPA for student-derived sources, RBAC on banks.

---

## 🚀 Possible Extensions

- **Add UI:** Blueprint editor with live preview and psychometric estimates after pilot.
- **Convert to SaaS:** Item bank marketplace with licensing metadata.
- **Add multi-agent collaboration:** BLOOMS-level tagger separate from writer.
- **Add real-time capabilities:** In-class “exit ticket” generator from whiteboard photo (policy gated).
- **Integrate with external systems:** Learnosity, Brillium, Google Forms.

---

## 🔁 Evolution Path

How this project can evolve:

- Rule-based → LLM → Tool-based → Agent → Multi-agent
- Start with **human-reviewed** banks before auto-publish to high-stakes pools.

---

## 🎓 What You Learn

- **Key concepts this project teaches**
  - **Structured** assessment generation
  - **Item bank** dedupe and versioning
  - **LMS export** realities
  - **System design thinking** for instructional scale
