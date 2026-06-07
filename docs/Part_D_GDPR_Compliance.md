# PART D: GDPR COMPLIANCE & PRIVACY

## D.1 The Legally Accurate Privacy Model

StudyPilot is built on a foundation of ethical engineering. We do not claim that tracking is "physically impossible"—a PWA is technically capable of tracking clicks and external navigation. 

Instead, our guarantee is: **We actively choose not to track you.**

### Data Minimization Strategy
- All granular study data (when you paused, session names, focus intervals) is stored exclusively in your browser's **IndexedDB**. 
- Our cloud database (Supabase) only stores:
  - `user_id`
  - `email`
  - `last_study_date` (for streak calculation)

### Explicit Analytics Opt-Out
By default, Vercel deployments include analytics collection. We will explicitly disable Vercel Web Analytics and Vercel Speed Insights in the production deployment to uphold our zero-tracking promise.

---

## D.2 GDPR Implementation Checklist

### Cookie Consent (ePrivacy Directive)
Because Supabase Auth relies on secure, HTTP-only cookies to maintain session state, we must obtain consent or establish legitimate interest. A lightweight consent banner will be presented during onboarding:
> *"StudyPilot uses essential cookies purely to keep you logged in. We do not use tracking or advertising cookies."*

### Data Portability (Article 20)
Users have the right to export their data in a machine-readable format.
When a user clicks "Export My Data", they receive a comprehensive `JSON` payload that includes:
1. Their `IndexedDB` local session history.
2. A direct API pull of their Supabase Auth metadata.
This fulfills the requirement of exporting all personal data without undue burden.
