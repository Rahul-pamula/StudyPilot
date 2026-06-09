-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exams table
CREATE TABLE public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    filename VARCHAR(255),
    exam_name VARCHAR(255),
    exam_date DATE,
    upload_date TIMESTAMPTZ DEFAULT NOW()
);

-- Topics table
CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    topic_name VARCHAR(200) NOT NULL,
    exam_weight_percentage FLOAT DEFAULT 0,
    lecture_hours INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards with SM-2 spaced repetition
CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    ease_factor FLOAT DEFAULT 2.5,
    repetitions INT DEFAULT 0,
    last_review_date DATE,
    next_review_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study sessions for tracking
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE,
    rating VARCHAR(20) CHECK (rating IN ('again', 'hard', 'easy')),
    response_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Exams: users can only see their exams
CREATE POLICY "Users can view own exams" ON public.exams
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own exams" ON public.exams
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own exams" ON public.exams
    FOR DELETE USING (auth.uid() = user_id);

-- Topics policies
CREATE POLICY "Users can view own topics" ON public.topics
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = exam_id AND exams.user_id = auth.uid()));
CREATE POLICY "Users can insert own topics" ON public.topics
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = exam_id AND exams.user_id = auth.uid()));

-- Flashcards policies
CREATE POLICY "Users can view own flashcards" ON public.flashcards
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcards" ON public.flashcards
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcards" ON public.flashcards
    FOR UPDATE USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can view own study sessions" ON public.study_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study sessions" ON public.study_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
