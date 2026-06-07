# PART C: PROFILE & SETTINGS (Analytics Dashboard)

## C.1 Profile Page Architecture: The A-Student Dashboard

The profile page is no longer a simple settings menu. It is an advanced analytics dashboard tracking the academic health of the student.

### Key Metrics Displayed:
1. **The Forgetting Curve Health:** Visual graph showing how many topics are currently "At Risk of Forgetting" vs "Mastered".
2. **Active Recall Ratio:** Percentage of study sessions that successfully passed the AI active recall gate (Target: >85%).
3. **Sleep vs. Retention Correlation:** A scatter plot (using Recharts) mapping the user's `sleep_hours_previous_night` against their `recall_score` to visually prove that all-nighters destroy retention.

---

## C.2 Settings & Preferences

### 1. Spaced Repetition Aggressiveness
Users can configure how strictly the app enforces review periods.
- **Cram Mode (1-2 weeks out):** Reviews scheduled at 1 hour, 1 day, 3 days.
- **Maintenance Mode:** Reviews scheduled at 1 day, 1 week, 3 weeks.

### 2. Active Recall Difficulty
- **Multiple Choice:** Easy mode.
- **Short Answer:** Medium mode (Groq evaluates semantics).
- **Feynman Technique:** Hard mode. The app prompts the user to "Teach this topic to a 5-year-old via Voice Transcription."

### 3. Morning Sleep Accountability
Toggle: *Require sleep logging before unlocking today's 80/20 study plan.*
