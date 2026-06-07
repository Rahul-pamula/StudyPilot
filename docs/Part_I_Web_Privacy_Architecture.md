# PART I: WEB PRIVACY ARCHITECTURE & SANDBOXING

## 1. The Browser Sandbox Advantage

By operating exclusively as a Web Application, StudyPilot inherently solves the biggest privacy concerns that plague desktop tracking apps.

### 1.1 What We CANNOT Do (By Design)
- ❌ **We cannot see other apps:** The browser physically isolates StudyPilot. It cannot see if you have VS Code, Spotify, or a video game open.
- ❌ **We cannot read files:** We have zero access to your local hard drive or documents.
- ❌ **We cannot record your screen:** Unless you explicitly click "Share Screen", we have no idea what is happening on your monitor.

**Why this is a feature, not a bug:** 
Students hate being spied on. By relying on the browser's native sandbox, we don't have to ask for scary OS-level permissions. We track your focus *within* the app (e.g., active timer, session logging), building a foundation of trust rather than surveillance.

---

## 2. Zero-Data Storage Policy

We must make it explicitly clear to users: **We do not store your behavioral data.**

### 2.1 Local Storage First
All granular study data (when you paused, what you typed in the scratchpad, your exact focus intervals) is stored in your browser's **Local Storage (IndexedDB/LocalStorage)**. It never touches our servers.

### 2.2 What Hits the Server? (Minimal Aggregation)
If you create an account to save your streaks, our database (Supabase) only stores:
- `user_id`
- `date`
- `total_minutes_focused`
- `current_streak`

**We do NOT store:**
- What websites you visited
- What applications you used
- Any telemetry logs

### 2.3 User-Facing Privacy Guarantee
This exact text will be displayed prominently on the Landing Page and the Timer dashboard:

> 🛡️ **StudyPilot is Sandboxed & Secure**
> This app runs in your browser. It cannot see your other tabs, it cannot see your desktop apps, and it cannot spy on your computer. Your granular study logs are saved locally on your device. We only sync your daily total minutes to save your streak. You are in complete control.
