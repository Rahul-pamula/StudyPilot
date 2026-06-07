# PART H: DYNAMIC EXAM STRATEGY

## 1. Dynamic Priority Score (Adjusted for Sleep Depletion)

A static priority formula based solely on exam weight is pedagogically flawed because it fails to account for the student’s actual capacity for memory consolidation. Sleep deprivation severely impairs cognitive retention and active recall performance. 

The scheduling engine must scale down the priority index of highly complex tasks when the student is sleep-deprived, shifting focus to lower-difficulty reviews or prompting recovery.

**The Advanced Priority Formula:**

$$Priority_{adj} = \left( (Exam Weight \times 2) + Lecture Hours \right) \times \left( \frac{Sleep Hours}{8.0} \right)^2$$

Where $Sleep Hours$ represents the value captured during the morning onboarding slider, capped at 8.0 hours. 

**Example:** If a student logs only 5.0 hours of sleep, their effective prioritization index scales down by approximately 60%, automatically realigning the daily planner away from heavy new topics to lighter, consolidated practice problems to prevent cognitive burnout.

---

## 2. Crisis Mode Protocol (The 24-Hour Save)

### Step 1: The Triage Cut
- The AI dynamically calculates the $Priority_{adj}$.
- The UI brutally informs the student: *"You do not have time to learn Thermodynamics. We are abandoning it. Focus 100% on Electricity (37% weight) to pass."*

### Step 2: Pure Active Recall
- Passive reading is banned. Crisis Mode locks the UI into a pure flashcard/practice problem interface. 
- All failures are logged aggressively to adjust the $Priority_{adj}$ graph.

### Step 3: The Hard Sleep Stop
- 10:00 PM the night before the exam.
- The app locks the active recall engine.
- **Message:** *"Studying all night actively destroys your retrieval ability. You will score 20% lower tomorrow if you don't sleep right now. Go to bed."*
