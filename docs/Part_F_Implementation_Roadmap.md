# PART F: IMPLEMENTATION ROADMAP (10-Week Enterprise MVP)

Building a truly robust AI-Powered Active Recall Platform with enterprise-grade compliance and pgvector infrastructure requires a **10-week engineering sprint**.

## Immediate Prerequisites (Before Week 1)
- **Dataset Collection:** Gather 20+ past exams from various disciplines to test generalization.
- **Prompt Validation:** Run all exams through Groq. Target F1 > 0.85.

---

## Phase 1: Foundation & Compliance (Weeks 1-2)
- Next.js + Supabase Auth.
- Implement `pgvector` SQL migrations.
- **Critical:** Build the 5-step in-memory PII Sanitization Pipeline using `unpdf` and local NER (Presidio). Ensure raw PDFs never touch persistent disk storage.

## Phase 2: Topic Extraction & Knowledge Graphs (Weeks 3-4)
- Finalize Groq Prompt engineering using the Vercel AI SDK to bypass Edge constraints.
- Map extracted topics into the `exam_topics` table, utilizing `parent_topic_id` to build semantic Directed Acyclic Graphs (DAGs).

## Phase 3: Active Recall Engine & Trajectory Logging (Weeks 5-6)
- Build the template-based question generation engine.
- Implement multi-dimensional rubric grading (Comprehensiveness, Accuracy, Coherence).
- Log all LLM evaluations to the `agent_trajectory_logs` table for auditing.

## Phase 4: Dynamic Spaced Repetition (Weeks 7-8)
- Implement the advanced mathematical Spaced Repetition algorithm factoring Response Time ($T$), Sleep ($S$), and Rubric Score ($R$).
- Build VAPID Web Push notifications.

## Phase 5: Deep Work Polish (Weeks 9-10)
- Implement the Deep Work Daily Schedule UI.
- Implement the Sleep lock mechanism and dynamic priority scaling.
- PWA testing across iOS, Android, and Desktop browsers.
