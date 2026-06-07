# PART D: GDPR COMPLIANCE & PRIVACY

## D.1 The Zero-Storage Privacy Model

By building StudyPilot as a Progressive Web App (PWA), we inherently eliminate the vast majority of GDPR and privacy liabilities. We embrace a **Zero-Storage Privacy Model**.

### Local Storage First
All granular study data (when you paused, what you typed in the scratchpad, your exact focus intervals, your session names) is stored exclusively in your browser's **IndexedDB / `localStorage`**. It never touches our servers.

### What Hits the Cloud Server?
If you create an account to save your streaks, our database (Supabase) only stores:
- `user_id`
- `email`
- `total_minutes_focused`
- `current_streak`

**We do NOT store:**
- What websites you visited (the browser sandbox prevents this anyway)
- What applications you used
- Any telemetry logs or screen activity

---

## D.2 GDPR Implementation Checklist

### User Rights Endpoints
Because we store almost no personal data, exporting and deleting is trivial.

```typescript
// Next.js Server Action for GDPR
export async function deleteUserAccount() {
  const supabase = createServerActionClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // 1. Delete from Supabase Auth (cascade deletes the profile streak)
    await supabase.auth.admin.deleteUser(user.id);
  }
  
  // 2. Client-side purge
  return { success: true, message: "Account deleted. Please clear local storage." };
}
```

### Data Portability
Users can click "Export My Data" in Settings. This simply triggers a client-side JSON download of their `localStorage` state. No server processing required.

### Cookie Consent
We do not use tracking cookies, Google Analytics, or third-party pixels. The only cookies used are secure, HTTP-only session tokens for Supabase Auth, which are strictly necessary and exempt from explicit GDPR cookie consent banners.

---

## D.3 User-Facing Privacy Guarantee

This exact text will be displayed prominently on the Landing Page and the Timer dashboard:

> 🛡️ **StudyPilot is Sandboxed & Secure**
> This app runs entirely in your browser. It physically cannot see your other tabs, it cannot see your desktop apps, and it cannot spy on your computer. Your granular study logs are saved locally on your device. We only sync your daily total minutes to save your streak. You are in complete control.
