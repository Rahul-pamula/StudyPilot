# Low-Level Design (LLD): StudyPilot Digital Wellbeing Tracker

## 1. Deep Work Session Lifecycle

### 1.1 Intent Capture (Frontend)
Before monitoring begins, the user must declare their intent on the Next.js Dashboard.
* **Prompt:** "What exactly are you going to study?"
* **Input:** User types: "I am studying React Hooks for my Web Dev exam."
* **API Call:** `POST /api/sessions/start` 
  * Payload: `{"intent": "React Hooks", "duration_minutes": 60}`

### 1.2 Telemetry Ingestion (Local Daemon)
A background Python daemon wakes up every 10 seconds for <1ms.
* **Mac Implementation:** Uses `AppKit.NSWorkspace` to get the active `localizedName`.
* **Storage:** Writes directly to the user's local `~/.studypilot/local_db.sqlite`. **No API call is made.**

---

## 2. The Local Verification Engine

### 2.1 Rule-Based Evaluation (Edge Processing)
The Python Daemon evaluates the active window against its local Distraction Matrix:

* **Blacklist:** e.g., "Instagram", "TikTok".
  * Action: Daemon triggers a local OS notification immediately.
* **Graylist:** e.g., "YouTube".
  * Action: Increments a local SQLite counter. If `> 30 minutes`, triggers Verification Engine.

### 2.2 The "Honesty" Popup (Native OS)
1. The Desktop Daemon natively triggers an OS-level Notification (Mac Notification Center / Windows Action Center).
   > **"Be honest. This is for you. What have you studied? 2 words. No cheating."**
2. User submits the 2 words into the popup prompt.

### 2.3 LLM Validation (The only API call)
The local daemon sends ONLY the 2-word submission to FastAPI.

* **API Call:** `POST /api/sessions/verify` -> `{"intent": "React", "submission": "use state"}`
* **FastAPI -> Groq LLM:** Validates conceptual similarity. Returns `True` or `False` to the daemon.

**Fallback Path (Rule-Based Match):**
If the Groq API fails, times out, or rate limits:
* Normalize both strings (lowercase, remove stop words).
* Calculate Jaccard similarity or simple string matching.
* If similarity > threshold, accept. Else, allow user to manually override.

---

## 3. Focus Score & Adaptive Nudging

### 3.1 Focus Score Calculation
Runs every 5 minutes in a Celery/Background task.
`Focus Score = (Study Time / (Study Time + Distraction Time)) * 100`

### 3.2 Adaptive Procrastination Protocol
When a user fails the verification or hits a Blacklisted app:
1. **First Offense (Empathetic):**
   * Pushes notification: "Hey, your exam is tomorrow at 9 AM. Instagram won't help you pass. Let's get back to the checklist."
2. **Repeated Offense (Adaptive Load):**
   * If > 3 offenses in an hour: "You're struggling today. Let's drop 2 tasks from your checklist and take a 15-minute break. Come back fresh."

---

## 4. Database Schema (Hybrid Model)

### Local Device Database (SQLite - `~/.studypilot/local_db.sqlite`)
*All raw data lives here and auto-deletes after 30 days.*

**`telemetry_logs`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR | Primary Key |
| `app_name` | VARCHAR | e.g., "Google Chrome" |
| `window_title` | VARCHAR | e.g., "YouTube" |
| `duration` | INT | Time in seconds |
| `created_at` | TIMESTAMP | Indexed for 30-day auto-prune |

### Cloud Backend Database (PostgreSQL)
*Stores ONLY aggregated stats for cross-device dashboard sync.*

**`daily_focus_scores`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key -> Users |
| `date` | DATE | 
| `focus_percentage` | INT | e.g., 85 |
