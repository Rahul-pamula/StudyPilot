# PART F: IMPLEMENTATION ROADMAP (V3 MVP Sprint)

The 6-week timeline has been re-architected. We are no longer building a bulletproof offline timer. We are building the **AI-Powered Active Recall Platform**.

## Phase 1: The 80/20 AI Analyzer (Weeks 1-2)
**Goal: Build the feature that makes students say "Wow."**
- **Week 1:** Next.js App Router setup, Supabase Auth. Build the PDF Upload UI component with drag-and-drop.
- **Week 2:** Integrate `pdf-parse` in Next.js Server Actions. Connect to **Groq API (Mixtral)** with strict prompt engineering to extract topics, calculate frequencies, and output JSON arrays of the highest-yield subjects.

## Phase 2: The Active Recall Engine (Weeks 3-4)
**Goal: Enforce quality studying.**
- **Week 3:** Build the "Active Recall Gate" UI. When a user marks a topic as "Studied", trigger Groq to instantly generate 3 short-answer questions based on the topic name and uploaded PDF context.
- **Week 4:** Implement the LLM Grading logic. Groq evaluates the student's text input against the correct concepts. If passing, write to the database and calculate the first Spaced Repetition interval.

## Phase 3: Sleep & Spaced Repetition (Weeks 5-6)
**Goal: The long-term retention loop.**
- **Week 5:** Build the Dashboard Analytics. Display the Forgetting Curve and the correlation between the user's logged sleep hours and their active recall success rates.
- **Week 6:** Implement VAPID Web Push notifications to ping users when a topic hits the 1-day, 3-day, or 1-week review window. Final deployment to Vercel.
