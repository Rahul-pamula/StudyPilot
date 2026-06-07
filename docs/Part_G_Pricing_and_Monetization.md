# PART G: PRICING & MONETIZATION STRATEGY

## 1. Core Principle: 100% Free for Students
**StudyPilot will always be free for students.** No paywalls, no premium tiers, no credit card required.

### 1.1 Target User Confirmation

| User Type | Payment Status | Reasoning |
|-----------|----------------|------------|
| Students (any level) | ❤️ **100% Free** | Core mission: help students succeed |
| Non-students (professionals) | 💰 Optional donation | If they want to support the project |
| Educational institutions | 💰 Paid licenses | Bulk deployment, admin dashboard |

---

## 2. Sustainability Model (No Student Fees)

### 2.1 Revenue Sources (Not from students)

| Source | Model | Target |
|--------|-------|--------|
| **University Partnerships** | Annual license for campus-wide deployment | $5,000-50,000 per university |
| **Corporate Wellness Programs** | Employee focus training (non-student) | $10/employee/month |
| **Donations** | "Buy us a coffee" (optional, no features locked) | $5-20/user |
| **Open Source Sponsors** | GitHub Sponsors, corporate backers | $1,000-10,000/month |

### 2.2 What Students Get for Free

```text
✅ Installable Mobile/Desktop PWA
✅ Unlimited Pomodoro sessions
✅ Exam Crisis Mode Planner
✅ Topic prioritization engine
✅ Panic button survival plans
✅ All future features
✅ No ads
✅ Zero-Data Storage Privacy
```

---

## 3. University Partnership Model

### 3.1 What Universities Pay For

| Feature | Students (Free) | University (Paid) |
|---------|----------------|-------------------|
| Individual accounts | ✅ | ✅ |
| Focus tracking | ✅ | ✅ |
| Exam planning | ✅ | ✅ |
| **Admin Dashboard** | ❌ | ✅ |
| **Department Analytics** | ❌ | ✅ |
| **SSO Integration** (Okta, Azure) | ❌ | ✅ |
| **LMS Integration** (Canvas) | ❌ | ✅ |

---

## 4. Cost Management & Transparency

### Keeping Infrastructure Affordable
By relying on `localStorage` for all granular data, our server costs are essentially zero.

| Service | Monthly Cost (1,000 users) | Optimization |
|---------|---------------------------|--------------|
| **Supabase Auth & DB** | $0 (free tier) | We only store streaks |
| **Next.js (Vercel)** | $0 (free tier) | Serverless functions |
| **Groq LLM API** | $0 (free tier) | Fast inference for Crisis Mode |
| **Total** | **$0/month** | Hyper-optimized edge architecture |

---

## 5. Official StudyPilot Pledge

```text
# The StudyPilot Student Promise

✅ We will never charge students.
✅ We will never show ads to students.
✅ We will never sell your data. (We don't even store it!)
✅ We exist to help students succeed without financial barriers.

Signed,
The StudyPilot Team
```
