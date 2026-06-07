# PART G: PRICING & CLOUD INFRASTRUCTURE COSTS

## 1. Core Principle: 100% Free for Students
**StudyPilot will always be free for students.** No paywalls, no premium tiers, no credit card required.

---

## 2. Infrastructure Cost Reality Check

Previous estimates assumed a "$0/month" cost by relying on free tiers. This is unrealistic for a scaling application. We must architect for actual infrastructure limits.

### 2.1 Vercel (Frontend & Serverless APIs)
- **The Limit:** The free tier offers 100GB of bandwidth and 6,000 build minutes.
- **The Reality:** 1,000 active daily users pulling PWA assets will quickly approach the 100GB limit.
- **The Plan:** We will upgrade to Vercel Pro ($20/mo) immediately upon hitting 500 DAU to ensure uptime and reliable serverless function execution.

### 2.2 Supabase (PostgreSQL & Auth)
- **The Limit:** The free tier offers 500MB database size and 2 active projects.
- **The Reality:** Because we only store a single row per user in the `profiles` table (`last_study_date`), 500MB can easily support 100,000+ users.
- **The Plan:** We will maintain the free tier for production, but must spin up a local Docker instance for staging, as the free tier restricts us to 2 active cloud projects.

### 2.3 Disaster Recovery Plan
Because we are the data controllers, we cannot blindly rely on Supabase's uptime.
- **Backup Strategy:** We will implement pg_dump backups to an external S3 bucket every 24 hours to ensure streak data is never permanently lost during a cloud outage.
