# PART F: IMPLEMENTATION ROADMAP (6-Week MVP)

Building a truly robust Progressive Web App that works offline and synchronizes across devices takes careful engineering. We have discarded the naive 14-day timeline in favor of a realistic 6-week engineering sprint focused entirely on the core engine.

## Phase 1: The Bulletproof Core (Weeks 1-3)
**Goal: A timer that never fails, even when the user closes their laptop.**

- **Week 1:** Next.js scaffolding, Supabase Auth integration, and RLS policies.
- **Week 2:** The Timer Engine. Implementing Web Workers for background counting and `WakeLock API` for desktop users.
- **Week 3:** Cross-device sync. Implementing `IndexedDB` for local storage and `BroadcastChannel API` for cross-tab synchronization.

## Phase 2: PWA Infrastructure & Gamification (Weeks 4-5)
**Goal: Making it feel like a native app with a reliable streak system.**

- **Week 4:** PWA configuration (`manifest.json`, Service Workers) and debugging iOS Safari background eviction quirks.
- **Week 5:** Streak Integrity. Writing the logic to calculate streaks dynamically from the `last_study_date` database field. Implementing Web Push Notifications (VAPID).

## Phase 3: Polish & Launch (Week 6)
**Goal: Responsive layout and compliance.**

- **Week 6:** Building the adaptive navigation (Bottom tabs for mobile, Sidebar for desktop). Adding Cookie Consent banners and Vercel analytics opt-outs. Final testing across 3 OS environments and 4 browser engines.

*(Note: The AI "Crisis Mode Planner" has been deferred to Version 1.1 to ensure the core MVP timer is flawless).*
