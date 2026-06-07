# VOLUME I: PRODUCT STRATEGY & REQUIREMENTS

## 1. Executive Summary

### 1.1 Product Vision
StudyPilot is a privacy-first digital wellbeing desktop application that eliminates student procrastination through honest self-tracking, AI-powered verification, and beautiful user experience. Unlike traditional productivity apps that rely on blocking, StudyPilot builds self-discipline through transparent feedback and genuine accountability.

### 1.2 Target Audience
- **Primary:** University students (18-25) struggling with distractions
- **Secondary:** High school students preparing for exams (15-18)
- **Tertiary:** Self-taught learners and bootcamp students

### 1.3 Unique Value Propositions
1. **Privacy-First Edge Architecture:** Raw screen data never leaves your computer
2. **Honesty Verification:** 2-word AI validation prevents cheating
3. **Multi-Intent Support:** Track multiple subjects in one session
4. **Context Switching Penalty:** Measures real focus, not just time
5. **Beautiful UX:** Designed for delight, not punishment

### 1.4 Success Metrics (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Onboarding Completion | >80% | Funnel analytics |
| 7-Day Retention | >40% | Daily active users |
| Average Focus Score | >65 | Aggregated scores |
| Session Duration | >45 min | Telemetry logs |
| Verification Pass Rate | >70% | LLM validation |
| App Store Rating | 4.5+ | User reviews |

---

## 2. Feature Requirements

### 2.1 MVP Features (Week 1-8)

#### Core Tracking
- [ ] Active window detection (every 10 seconds)
- [ ] App classification (Study/Distraction/Graylist)
- [ ] Local SQLite storage with 30-day auto-cleanup
- [ ] Manual session start/stop

#### Focus Sessions
- [ ] Multi-intent capture (2 subjects per session)
- [ ] Timer with pause/resume
- [ ] 2-word honesty popups for distractions
- [ ] Focus score calculation

#### User System
- [ ] Email/password authentication
- [ ] Google OAuth
- [ ] Email verification (6-digit code)
- [ ] Profile management

#### Dashboard
- [ ] Today's focus score (ring chart)
- [ ] Weekly study minutes (bar chart)
- [ ] Recent sessions list
- [ ] Current streak display

#### Privacy & GDPR
- [ ] Data export (JSON/CSV)
- [ ] Account deletion
- [ ] Cookie consent banner
- [ ] Privacy policy page

### 2.2 Post-MVP Features (Week 9-12)

#### Advanced Analytics
- [ ] App breakdown (time per application)
- [ ] Subject progress tracking
- [ ] Honesty score over time
- [ ] Export reports (PDF)

#### Social Features
- [ ] Study groups (shared goals)
- [ ] Leaderboards (optional, opt-in)
- [ ] Accountability buddies
- [ ] Share focus streaks

#### AI Enhancements
- [ ] Personalized study recommendations
- [ ] Distraction pattern detection
- [ ] Adaptive session lengths
- [ ] Smart break suggestions

#### Integrations
- [ ] Google Calendar sync
- [ ] Notion task import
- [ ] Discord rich presence
- [ ] Spotify focus playlists
