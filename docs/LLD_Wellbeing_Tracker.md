# Low-Level Design (LLD): StudyPilot Digital Wellbeing Tracker

## 1. Deep Work & Multi-Tasking Session Lifecycle

### 1.1 Multi-Intent Capture (Frontend)
Users often study multiple subjects. We must handle **Multi-Tasking**.
* **Prompt:** "What are your primary and secondary goals for this session?"
* **Input:** User types Primary: "React Hooks", Secondary: "Python APIs".
* **API Call:** `POST /api/sessions/start` 
  * Payload: `{"intents": ["React Hooks", "Python APIs"], "duration_minutes": 120}`

### 1.2 Telemetry Ingestion & Open Counts (Local Daemon)
A background Python daemon wakes up every 10 seconds for <1ms.
* **Tracking Open Counts:** It does not just track *duration*; it tracks **how many times an app is opened**. 
* If the user switches between Chrome and VS Code 50 times in 10 minutes, that is highly inefficient multi-tasking context switching.
* **Storage:** Writes to local `~/.studypilot/local_db.sqlite`.
  * Increments `duration_seconds += 10`.
  * If the active window changed since the last tick, increments `open_count += 1`.

### 1.3 The Master Kill Switch
If the user clicks "Stop Tracking" on the Web UI:
1. FastAPI sends an SSE (Server-Sent Event) or WebSocket message to the Daemon.
2. The Daemon sets `is_tracking_active = False` and breaks the polling loop, sleeping until a new session begins.

---

## 2. The Local Verification Engine

### 2.1 Multi-Tasking Context Penalty (Edge Processing)
The Python Daemon evaluates the telemetry against rules:

* **Blacklist:** e.g., "Instagram". Immediate local OS notification triggered.
* **Graylist:** e.g., "YouTube". Triggers popup if `duration > 30 mins`.
* **Context Switching Penalty:** If `open_count > 15` in a 10-minute window (user is thrashing between tasks), trigger the Honesty Popup:
  > *"You are multi-tasking too much. Focus. Which task are you doing right now? 2 words."*

### 2.2 LLM Validation (Multi-Intent Validation)
The local daemon sends the 2-word submission to FastAPI.

* **API Call:** `POST /api/sessions/verify`
* **FastAPI -> Groq LLM Prompt:** "The user has two intents: ['React', 'Python']. They summarized their current focus as: 'building APIs'. Does this match ANY of their declared intents? Answer YES or NO."

---

## 3. Focus Score & Adaptive Nudging

### 3.1 Focus Score Calculation
Runs every 5 minutes locally.
`Focus Score = (Study Time / (Study Time + Distraction Time + (Context_Switches * Penalty_Weight))) * 100`
*The more you bounce between apps, the lower your score goes.*

### 3.2 Adaptive Procrastination Protocol
1. **First Offense:** "Instagram won't help you pass. Let's get back to the checklist."
2. **Repeated Offense:** "You're struggling today. Let's drop 2 tasks from your checklist and take a 15-minute break. Come back fresh."

---

## 4. Database Schema (Hybrid Model)

### 4.1 Local Device Database (SQLite)
*All raw data lives here and auto-deletes after 30 days.*

**`telemetry_logs`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR | Primary Key |
| `app_name` | VARCHAR | e.g., "Google Chrome" |
| `window_title` | VARCHAR | e.g., "YouTube" |
| `duration` | INT | Total seconds focused |
| `open_count` | INT | **How many times this app was clicked/opened** |
| `created_at` | TIMESTAMP | Indexed for 30-day auto-prune |

### 4.2 Cloud Backend Database (PostgreSQL - RLS Enabled)
*Stores ONLY aggregated stats. Isolated by Tenant ID.*

**`daily_focus_scores`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | **Tenant ID (RLS Enforcement Key)** |
| `date` | DATE | 
| `focus_percentage` | INT | e.g., 85 |
| `context_switches` | INT | Total multi-tasking jumps today |
