# PART F: IMPLEMENTATION ROADMAP

## Phase 1: Foundation (Week 1-2)
- [ ] Landing page with download buttons
- [ ] Supabase Auth integration (Google + email)
- [ ] Basic Electron shell + auto-updater
- [ ] PostgreSQL schema with RLS

## Phase 2: Onboarding (Week 3)
- [ ] 4-step beautiful onboarding flow
- [ ] Profile creation and preferences
- [ ] GDPR consent banner
- [ ] Email verification flow

## Phase 3: Core Feature (Week 4-6)
- [ ] Python daemon with OS telemetry
- [ ] Preparation Mode (2-word verification)
- [ ] Focus Score dashboard
- [ ] Desktop notifications

## Phase 4: Polish (Week 7-8)
- [ ] Profile page with all subpages
- [ ] Settings panel (appearance, notifications)
- [ ] GDPR data export/delete
- [ ] Analytics dashboard with charts

## Phase 5: Launch Prep (Week 9)
- [ ] App signing (Windows/macOS)
- [ ] Landing page SEO + analytics
- [ ] Error tracking (Sentry)
- [ ] Beta testing with 100 users

---

## 📁 File Structure (Desktop App)

```text
studypilot-desktop/
├── src/
│   ├── main/
│   │   ├── index.ts           # Electron main process
│   │   ├── ipc-handlers.ts    # IPC bridge to Python
│   │   └── auto-updater.ts
│   ├── renderer/
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Onboarding/
│   │   │   │   ├── Step1.tsx
│   │   │   │   ├── Step2.tsx
│   │   │   │   ├── Step3.tsx
│   │   │   │   └── Step4.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Profile/
│   │   │   │   ├── Index.tsx
│   │   │   │   ├── Settings/
│   │   │   │   │   ├── Account.tsx
│   │   │   │   │   ├── Privacy.tsx
│   │   │   │   │   └── Appearance.tsx
│   │   │   │   └── Help.tsx
│   │   │   └── StudySession.tsx
│   │   ├── components/
│   │   │   ├── ui/            # Radix primitives
│   │   │   ├── FocusRing.tsx
│   │   │   └── Toast.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useTelemetry.ts
│   │   └── store/
│   │       └── userStore.ts
│   └── python-daemon/
│       ├── tracker.py
│       ├── websocket_client.py
│       └── local_db.py
├── electron-builder.json
└── package.json
```
