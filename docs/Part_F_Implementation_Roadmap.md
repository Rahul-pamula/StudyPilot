# PART F: IMPLEMENTATION ROADMAP (14-Day MVP Sprint)

By pivoting to a Progressive Web App, we drastically reduce our time-to-market. The massive 9-week desktop roadmap is replaced by a highly focused 14-day sprint.

## Sprint 1: Foundation & Timer Engine (Days 1-7)
- [x] Architecture Planning & PWA Strategy
- [x] Next.js 14 App Router scaffold
- [ ] Supabase Auth integration (Google OAuth)
- [ ] Mobile-First Layout (Bottom Tabs / Desktop Sidebar)
- [ ] Core Pomodoro Timer Engine (using `Date.now()` for background resilience)
- [ ] LocalStorage synchronization hook

## Sprint 2: The Viral Hook (Days 8-14)
- [ ] "Crisis Mode" Exam Registration Form
- [ ] Groq API integration via Next.js Server Actions
- [ ] Prompt engineering for generating survival study plans
- [ ] Profile / Dashboard view (fetching daily streak from Supabase)
- [ ] Add `next-pwa` for offline service workers and `manifest.json`
- [ ] Vercel Deployment & Lighthouse PWA Audit

---

## 📁 File Structure (Next.js PWA)

```text
studypilot-web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── timer/page.tsx
│   │   │   ├── crisis/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── layout.tsx         # Includes mobile bottom nav
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Shadcn primitives
│   │   ├── TimerDisplay.tsx
│   │   └── FocusRing.tsx
│   ├── hooks/
│   │   ├── useTimer.ts        # Zustand + LocalStorage
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── supabase/client.ts
│   │   └── groq.ts            # LLM API
│   └── actions/               # Server Actions
│       └── generatePlan.ts
├── public/
│   ├── manifest.json          # PWA requirements
│   └── icons/
├── tailwind.config.ts
└── next.config.mjs            # next-pwa plugin
```
