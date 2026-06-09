export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface Exam {
  id: string
  user_id: string
  filename: string | null
  exam_name: string | null
  exam_date: string | null
  upload_date: string
  topics?: Topic[]
}

export interface Topic {
  id: string
  exam_id: string
  topic_name: string
  exam_weight_percentage: number
  lecture_hours: number
  created_at: string
}

export interface Flashcard {
  id: string
  user_id: string
  topic_id: string
  question: string
  answer: string
  ease_factor: number
  repetitions: number
  last_review_date: string | null
  next_review_date: string | null
  created_at: string
  topic?: Topic
}

export interface StudySession {
  id: string
  user_id: string
  flashcard_id: string
  rating: 'again' | 'hard' | 'easy'
  response_time_ms: number
  created_at: string
}

export interface ExamAnalysis {
  topics: {
    topic_name: string
    exam_weight_percentage: number
    lecture_hours: number
    key_concepts: string[]
  }[]
  summary: string
  difficulty_level: string
}

export interface FlashcardGeneration {
  flashcards: {
    question: string
    answer: string
  }[]
}

export interface CrisisPlan {
  plan: {
    time_block: string
    topic: string
    activity: string
    priority: 'critical' | 'high' | 'medium'
  }[]
  tips: string[]
}
