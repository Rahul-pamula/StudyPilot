# PART G: PRICING & MONETIZATION STRATEGY (Donation-Only)

## G.1 Core Principle: The Free Tool Philosophy

"Students are broke. They'll use a worse free app before paying $5."

StudyPilot is not a SaaS. It is a utility that *should* exist. We are abandoning the Freemium/Pro tier model. The application will be **100% Free** for all students, with no paywalls, no limits, and no "upgrade now" modals.

---

## G.2 The Real Economics (Cost Calculation)

Because of our Offline-First AI Architecture, cloud costs are essentially zero.

### Monthly Server Costs for 10,000 Active Users

| Service | Usage | Cost (USD) | Cost (₹) |
|---------|-------|------------|----------|
| **Supabase (PostgreSQL)** | 10k users, 500MB data | $25/mo | **₹2,100** |
| **Vercel (Hosting)** | 10k visitors, 100GB bandwidth | $20/mo | **₹1,680** |
| **Vercel Blob (Temp PDF storage)** | 500 PDFs/month (auto-delete) | $5/mo | **₹420** |
| **Groq API (Cloud AI)** | Topic extraction + borderline grading | $10/mo | **₹840** |
| **Domain + SSL** | Already have | $0 | **₹0** |
| **TOTAL** | | **$60/mo** | **≈ ₹5,040** |

**For 10,000 active students: ₹5,040 per month = ₹0.50 per student per month.**

---

## G.3 The "Revenue Generation" Path

When you build something genuinely useful, money automatically comes as a byproduct of value.

### Step 1: The Donation Button
```tsx
// Footer component
<div className="text-center text-gray-500 text-sm py-8">
  <p>StudyPilot is free because students shouldn't pay to learn.</p>
  <a href="https://ko-fi.com/studypilot" className="text-blue-400 hover:underline">
    Support development → 
  </a>
</div>
```
When a student donates, they receive an optional "Supporter" star badge next to their profile name. Nothing more.

### Step 2: Realistic Revenue Timeline

| Source | Timeline | Amount | Effort |
|--------|----------|--------|--------|
| Donations | Month 1 | $20-200/mo (₹1,600-16,000) | Low (add a button) |
| GitHub Sponsors | Month 3 | $100-500/mo (₹8,000-40,000) | Low (open source it) |
| Research grant | Month 6 | $5k-20k | Medium (email professors) |
| University pilot | Month 9 | $10k-50k | High (sales meetings) |

### Step 3: Donation Potential at Scale (10k Users)

| Region | User Base | Donation Rate | Avg Donation | Monthly Total |
|--------|-----------|---------------|--------------|---------------|
| India | 10,000 | 1% | ₹50 | ₹5,000 |
| US/Europe | 2,000 | 2% | $5 (₹415) | ₹16,600 |
| **Combined** | **12,000** | | | **₹21,600/mo** |

With just 12,000 users globally, monthly donations (₹21,600) easily exceed the total server costs (₹5,040), yielding a sustainable profit while keeping the platform entirely free.

---

## G.4 The Only Thing That Matters

> **"When we work on purpose, money automatically comes."**

Students will Venmo you $5 when your app saves their grade. Professors will find grant money when you solve their retention problem. Universities will pay when you show data.

We don't need to ask for money. We need to build something worth paying for, then let people decide.
