# VOLUME IV: DATABASE DESIGN

## 8. PostgreSQL Schema

### 8.1 Core Tables

```sql
-- Extended profile data
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    study_streak INT DEFAULT 0,
    total_study_hours INT DEFAULT 0
);

-- Study sessions
CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    intents TEXT[] NOT NULL,
    duration_mins INT NOT NULL,
    focus_score INT CHECK (focus_score >= 0 AND focus_score <= 100),
    context_switches INT DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'completed'
);

-- Daily aggregates (denormalized for performance)
CREATE TABLE daily_focus_aggregates (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_study_mins INT DEFAULT 0,
    avg_focus_score INT,
    context_switches_total INT DEFAULT 0,
    PRIMARY KEY (user_id, date)
);
```

---

## 9. Local SQLite Schema (Edge Storage)

```sql
-- ~/.studypilot/local.db
-- Auto-delete after 30 days (cron job)

-- Raw telemetry (never leaves device)
CREATE TABLE telemetry_logs (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    app_name VARCHAR(255) NOT NULL,
    window_title TEXT,
    duration_seconds INT DEFAULT 10,
    open_count INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session state (resumable)
CREATE TABLE active_sessions (
    session_id TEXT PRIMARY KEY,
    intents TEXT,
    started_at TIMESTAMP
);

-- Auto-prune (run daily)
CREATE EVENT auto_prune_telemetry
ON SCHEDULE EVERY 1 DAY
DO
DELETE FROM telemetry_logs WHERE created_at < DATE('now', '-30 days');
```
