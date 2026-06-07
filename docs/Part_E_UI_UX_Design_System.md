# PART E: UI/UX DESIGN SYSTEM (Adaptive PWA)

## E.1 Responsive Navigation Paradigms

A critical flaw in naive mobile-first design is assuming mobile layouts (like bottom tab bars) work well on desktop. Desktop users expect standard productivity app layouts.

StudyPilot adapts its navigation based on the device viewport:

### 1. Mobile (`< 768px`)
- **Bottom Tab Navigation:** Ergonomic for thumbs. (Timer | Crisis | Logs | Profile)
- Safe area padding for iOS home indicator (`pb-20`).

### 2. Tablet (`768px - 1024px`)
- **Top Navigation:** Primary links move to a standard top header.
- **Floating Action Button (FAB):** For starting quick timer sessions.

### 3. Desktop (`> 1024px`)
- **Left Sidebar:** The standard paradigm for productivity web apps. Allows for deeper navigation trees and better use of widescreen real estate.

---

## E.2 The Psychology of UI Feedback

### Positive Reinforcement 
In previous designs, "Crisis Mode" relied on punitive audio (loud beeps) to force focus. This is actively harmful to student mental health and triggers anxiety.

**The Fix:** We exclusively use positive reinforcement. 
- *Instead of:* "You left the tab! BEEP!"
- *We use:* "Great job staying focused for 25 minutes! +5 Focus Points added to your daily score."

### Beautiful Toast Notifications
```tsx
// Positive reinforcement toast
toast.success({
  title: "🎉 Deep Work Achieved!",
  description: "You crushed that Pomodoro session.",
  duration: 4000,
  icon: <Sparkles className="text-yellow-400" />
});
```
