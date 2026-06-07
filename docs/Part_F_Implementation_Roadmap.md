# PART F: IMPLEMENTATION ROADMAP (10-Week MVP)

Building a truly robust AI-Powered Active Recall Platform with offline-first capabilities requires careful engineering. We have adjusted the timeline to a realistic **10-week engineering sprint** focused on prompt validation, data integrity, and fallback mechanisms.

## Immediate Prerequisites (Before Week 1)
- **Dataset Collection:** Gather 20+ past exams from various disciplines (STEM, Humanities) to test generalization.
- **Prompt Validation:** Run all exams through Groq. Measure Precision (topics extracted that appear) and Recall (topics that appear but weren't extracted). Target F1 > 0.85.

---

## Phase 1: Foundation (Weeks 1-2)
- Next.js + Supabase Auth.
- PDF upload component with drag-and-drop UI.
- Test Groq extraction on the 20+ real exams.

## Phase 2: Topic Extraction & Fallbacks (Weeks 3-4)
- Finalize Groq Prompt engineering (expecting 5-10 iterations).
- Build the async queue for PDF processing.
- **Critical:** Implement the `tesseract.js` OCR fallback for scanned, image-based exams.

## Phase 3: Active Recall Engine (Weeks 5-6)
- Build the template-based question generation engine.
- Implement keyword grading for immediate offline feedback (handles 80% of use cases).
- Integrate the `MiniLM` offline embedding model for semantic similarity grading.

## Phase 4: Spaced Repetition & Notifications (Weeks 7-8)
- Implement the SM-2 Spaced Repetition mathematical algorithm.
- Build the VAPID Web Push notification architecture and Server Cron Jobs.
- Dashboard analytics (using Recharts).

## Phase 5: Crisis Mode & Polish (Weeks 9-10)
- Build the Academic Triage logic (dropping low-weight topics).
- Implement the Sleep lock mechanism.
- PWA testing across iOS, Android, and Desktop browsers. Performance optimization.
