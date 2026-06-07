# PART J: PROGRESSIVE WEB APP (PWA) MVP ARCHITECTURE

## 1. The PWA Web MVP Strategy

Based on rigorous architectural review, StudyPilot's Version 1.0 MVP will be built as a **Progressive Web App (PWA)**. 

We are explicitly dropping the Electron Desktop Wrapper and Python Background Daemon for the MVP phase. This drastically reduces legal, privacy, and technical risks while enabling a 14-day launch cycle.

### 1.1 Key Advantages of the PWA Pivot
- **Frictionless Mobile Adoption:** Users can "Add to Home Screen" on iOS and Android. It opens full-screen without Safari/Chrome URL bars.
- **Zero App Store Taxation:** Bypasses Apple's 30% cut and the 2-week App Store review process.
- **Unified Codebase:** A single Next.js + Tailwind codebase powers the Desktop Web, iOS PWA, and Android PWA.

---

## 2. Technical Stack (MVP)

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | Next.js 14 (App Router) | Core application routing and server-side rendering |
| **PWA Engine** | `next-pwa` | Service workers for offline caching and `manifest.json` |
| **Styling** | TailwindCSS + Shadcn UI | Mobile-first responsive UI |
| **State Management** | Zustand | Global timer state |
| **Local Persistence** | `localStorage` / IndexedDB | Zero-storage privacy model (all session data stays on device) |
| **Authentication** | Supabase Auth | Google OAuth + Email magic links |
| **AI Integration** | Groq API (via Next.js Server Actions) | Powers the "Exam Crisis Mode" planner |

---

## 3. PWA Specific Infrastructure

### 3.1 Mobile-First UI/UX Architecture
Because the majority of students will access the MVP from their phones, the design must be mobile-native:
- **Bottom Navigation Bar:** Mobile screens will feature a native-feeling bottom tab bar (`Home | Timer | Crisis | Profile`).
- **Desktop Adaptation:** On viewports `>768px`, the bottom tab bar automatically snaps to a left-hand persistent sidebar.
- **Safe Area Padding:** iOS CSS properties (`env(safe-area-inset-bottom)`) will be used to ensure the UI does not clash with the iPhone notch or home indicator.

### 3.2 Background Throttling Defense
**The Problem:** Mobile browsers heavily throttle or completely freeze JavaScript when the user minimizes the browser (e.g., to answer a text). A standard `setInterval` Pomodoro timer will lose time.
**The PWA Solution:** The timer state is calculated via absolute `Date.now()` timestamp diffs.
- `endTime = Date.now() + (25 * 60000)`
- The UI calculates `remainingTime = endTime - Date.now()` on every animation frame.
- Even if the app is frozen for 10 minutes, when the user opens it again, the timer is perfectly synced.

---

## 4. Feature Prioritization (14-Day Sprint)

### Sprint 1: Core Mechanics (Days 1-7)
1. **PWA Scaffold:** Next.js + Tailwind + `manifest.json`
2. **Auth Layer:** Supabase Google Sign-in
3. **The Timer Engine:** Resilient Pomodoro timer with local storage persistence
4. **Manual Study Logging:** A simple form to input "What I studied"

### Sprint 2: The Viral Hook (Days 8-14)
1. **Exam Crisis Mode Planner:** The multi-step intake form for last-minute learners.
2. **AI Integration:** Sending the syllabus to Groq and rendering the output survival plan.
3. **Dashboard Stats:** Fetching the daily streak from Supabase.
4. **Deployment:** Pushing to Vercel and performing Lighthouse PWA audits.

---

## 5. Privacy Commitment Enforcement
This PWA architecture perfectly enforces our **Zero-Data Storage Policy** (Part I). 
By relying purely on client-side state (`localStorage`) for the timer and granular study logs, our Supabase cloud database only ever sees the user's `email`, `total_minutes`, and `streak_count`.
