# PART B: DATABASE SCHEMA & ONBOARDING

## B.1 Database Schema: Tracking Quality, Not Quantity

We have completely removed `total_minutes_studied` from our metrics. The database is strictly designed around the **5 Pillars of Academic Success**.

```sql
-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    
    -- Quality Metrics
    total_active_recall_sessions INT DEFAULT 0,
    practice_problems_solved INT DEFAULT 0,
    past_exams_analyzed INT DEFAULT 0,
    average_sleep_hours FLOAT DEFAULT 0.0,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Analysis Results (The 80/20 Planner)
CREATE TABLE public.exam_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    topic_name VARCHAR(200) NOT NULL,
    appearance_frequency INT, -- How many times it appeared in past exams
    exam_weight_percentage FLOAT,
    user_mastery_level INT DEFAULT 0, -- 0 to 100 based on active recall success
    next_review_date DATE, -- Spaced repetition scheduling
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active Recall Logs
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    topic_id UUID REFERENCES exam_topics(id),
    recall_score FLOAT, -- Grading provided by Groq LLM
    sleep_hours_previous_night FLOAT,
    status VARCHAR(20), -- 'PASS', 'FAIL_PASSIVE', 'PENDING'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## B.2 Onboarding Flow

Onboarding no longer focuses on timers. It focuses on gathering the raw material for academic success.

### Step 1: The Reality Check
"How much sleep did you get last night?" (Slider 0-12 hours).
*If < 7 hours: "Warning: Your memory consolidation is severely impaired today. Deep learning will be 40% less effective."*

### Step 2: Upload Past Papers
"A-Students don't read the textbook from page 1. They analyze the finish line. Upload up to 3 past exams for your hardest class."
- User uploads PDFs.
- Loading screen while Groq extracts the 80/20 topics.

### Step 3: The 80/20 Plan Revealed
"Here are the 3 topics that make up 65% of your final grade. This is your study plan."
