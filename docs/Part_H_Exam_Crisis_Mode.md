# PART H: EXAM CRISIS MODE (V3 Implementation)

## 1. The Brutal Truth About Crisis Mode

In previous versions, "Crisis Mode" was a timer with red alarms. As the "A-Student Blueprint" review pointed out, **a timer won't save you 24 hours before an exam.** Only high-yield active recall can save you.

## 2. Crisis Mode Protocol (The 24-Hour Save)

When a student clicks the "Crisis Mode" button (indicating an exam is <48 hours away), StudyPilot initiates an extreme academic triage protocol.

### Step 1: The Triage Cut
- The AI completely drops all topics that have less than a 10% exam weight.
- The UI brutally informs the student: *"You do not have time to learn Thermodynamics. We are abandoning it. Focus 100% on Electricity (37% weight) to pass."*

### Step 2: Pure Active Recall (No Reading Allowed)
- Passive reading is banned. 
- Crisis Mode locks the UI into a pure flashcard/practice problem interface. 
- The user is bombarded with AI-generated practice questions specifically targeting their "High-Weight / Low-Confidence" topics.

### Step 3: The Hard Sleep Stop
- 10:00 PM the night before the exam.
- The app locks the active recall engine.
- **Message:** *"Studying all night actively destroys your retrieval ability. You will score 20% lower tomorrow if you don't sleep right now. Go to bed."*
- If the user overrides it, the app explicitly logs the failure and predicts a grade penalty.

---

## 3. The 7-Day Protocol Tracker

For students starting a week out, the Dashboard transforms into the 7-Day Checklist:

- `[ ]` **Day 7:** Take full practice exam (Upload results to StudyPilot for weak-spot analysis)
- `[ ]` **Day 6-4:** Targeted Active Recall on weak spots only
- `[ ]` **Day 3-2:** No new material. Re-test missed practice questions.
- `[ ]` **Day 1:** Light review. Sleep 8+ hours.
