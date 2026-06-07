# PART B: DATABASE SCHEMA & SEMANTIC TRACKING

## B.1 Database Schema: pgvector, Flashcards & Trajectory Logging

To support true semantic RAG operations, offline spaced repetition, and mitigate LLM grading biases, the database utilizes `pgvector` and comprehensive multi-turn trajectory logging.

```sql
-- Enable the vector extension for semantic analysis and RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles table tracking high-level student performance
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    total_active_recall_sessions INT DEFAULT 0,
    practice_problems_solved INT DEFAULT 0,
    past_exams_analyzed INT DEFAULT 0,
    average_sleep_hours FLOAT DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Analysis Results (Graph-compatible layout)
CREATE TABLE public.exam_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_name VARCHAR(200) NOT NULL,
    topic_embedding vector(1536), -- Vector representation of topic for semantic search
    appearance_frequency INT,
    exam_weight_percentage FLOAT,
    user_mastery_level INT DEFAULT 0,
    parent_topic_id UUID REFERENCES exam_topics(id) ON DELETE SET NULL, -- Knowledge graphing
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards for Spaced Repetition
CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES exam_topics(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    
    -- SM-2 state
    ease_factor FLOAT DEFAULT 2.5,
    repetitions INT DEFAULT 0,
    last_review_date DATE,
    next_review_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active Recall Logging with Rubric and Response Time Tracking
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES exam_topics(id) ON DELETE CASCADE,
    raw_user_input TEXT,
    response_duration_ms INT,
    comprehensiveness_score FLOAT,
    accuracy_score FLOAT,
    coherence_score FLOAT,
    final_evaluation_score FLOAT,
    uncertainty_index FLOAT,
    sleep_hours_previous_night FLOAT,
    status VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track each recall attempt for analytics and offline sync queue
CREATE TABLE public.recall_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
    success BOOLEAN,
    response_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trajectory Logs for AI Agent Audits
CREATE TABLE public.agent_trajectory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.study_sessions(id) ON DELETE CASCADE,
    prompt_template_version VARCHAR(50),
    raw_llm_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```
