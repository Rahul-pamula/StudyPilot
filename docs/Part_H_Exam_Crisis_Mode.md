# PART H: DYNAMIC EXAM STRATEGY

## 1. Dynamic Priority Score (Adjusted for Sleep Depletion)

A static priority formula based solely on exam weight is pedagogically flawed because it fails to account for the student’s actual capacity for memory consolidation. Sleep deprivation impairs cognitive retention and active recall performance. 

The scheduling engine must scale down the priority index of highly complex tasks when the student is sleep-deprived, shifting focus to lower-difficulty reviews or prompting recovery.

**The Advanced Priority Formula (Linear Scaling):**

A sleep-deprived student can still learn, just slower. We use linear scaling with a hard floor of 0.5 (50% efficiency) rather than aggressive exponential punishment.

```typescript
const sleepMultiplier = Math.max(0.5, Math.min(1.0, sleepHours / 8.0));
const priorityAdj = ((examWeight * 2) + lectureHours) * sleepMultiplier;
```
*At 4 hours sleep, the multiplier is 0.5 (50% reduction). At 8+ hours, it is 1.0. Sleeping 12 hours provides no extra bonus.*

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
