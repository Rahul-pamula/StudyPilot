# PART H: EXAM CRISIS MODE (V1.1 Feature)

*(Note: This feature is slated for Version 1.1, following the completion of the 6-Week Core MVP sprint).*

## 1. The Psychology of Last-Minute Learning

### Persona: "The Crammer"
- **Behavior:** Studies 1-2 days before exam
- **Pain points:** High anxiety, poor retention, all-nighters

## 2. Emergency Features for Crisis Mode

### 2.1 Panic Button 🚨
**Click Behavior:**
1. **Emergency Assessment:** Chapters left, Energy level.
2. **AI Response:** Skip lowest weight chapters, focus strictly on high-yield topics.

### 2.2 Positive Reinforcement Web Guard
**Feature:** Nudging when dangerous patterns are detected based on the manual timer log.

**Triggers:**
- Timer runs > 12 hours in 24h → UI gently suggests: *"You've studied 12 hours. Your brain consolidates memory during sleep. Consider a break."*

### 2.3 Tab Focus Reinforcement
**Crucial Correction:** We do NOT play loud beeps or punishment audio if a user switches tabs. This is actively harmful design and legally questionable.
**Instead:** We reward focus. If the `document.visibilityState` remains "visible" for the entire 25-minute Pomodoro, we reward the user with a streak multiplier or confetti animation.

## 3. Pricing Strategy: 100% Free For Students
We do not monetize student anxiety. The Panic Button and AI Study Plans are 100% free.
