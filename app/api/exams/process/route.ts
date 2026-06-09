import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { callGroq } from '@/lib/groq/client'
import { ExamAnalysis, FlashcardGeneration } from '@/types/database'

export async function POST(req: Request) {
  try {
    const { filename, examName, text } = await req.json()
    
    // Validate request
    if (!text || text.length < 50) {
      return NextResponse.json({ error: 'Text content is too short or invalid' }, { status: 400 })
    }

    // Since we need user ID, we fetch it using standard headers approach (in a real app, use auth middleware context)
    // For this boilerplate, we'll extract token from cookie manually or rely on client sending user_id.
    // However, the cleanest way is using Supabase Auth with cookies via `createServerClient` but since this is an API route,
    // let's create a server client
    const { createServerClient } = require('@supabase/ssr')
    const { cookies } = require('next/headers')
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // --- STEP 1: Analyze 80/20 Topics via Groq ---
    const analysisPrompt = `
      Analyze the following academic document/exam. Extract the highest yield topics (the 80/20 rule).
      Return a JSON object matching this exact structure:
      {
        "topics": [
          {
            "topic_name": "string (name of topic)",
            "exam_weight_percentage": number (estimated weight 0-100),
            "lecture_hours": number (estimated hours to study),
            "key_concepts": ["concept1", "concept2"]
          }
        ],
        "summary": "string",
        "difficulty_level": "string"
      }
      Document Text: ${text.substring(0, 15000)} // Truncating to avoid token limits
    `
    
    const analysisJsonStr = await callGroq(analysisPrompt)
    const analysis: ExamAnalysis = JSON.parse(analysisJsonStr)

    // --- STEP 2: Save to Database (Exam + Topics) ---
    const supabaseAdmin = createAdminClient()
    
    const { data: examData, error: examError } = await supabaseAdmin
      .from('exams')
      .insert({
        user_id: user.id,
        filename,
        exam_name: examName,
        exam_date: new Date().toISOString()
      })
      .select()
      .single()

    if (examError || !examData) throw new Error(examError?.message || 'Failed to create exam record')

    const topicInserts = analysis.topics.map((t: any) => ({
      exam_id: examData.id,
      topic_name: t.topic_name,
      exam_weight_percentage: t.exam_weight_percentage,
      lecture_hours: t.lecture_hours
    }))

    const { data: insertedTopics, error: topicsError } = await supabaseAdmin
      .from('topics')
      .insert(topicInserts)
      .select()

    if (topicsError || !insertedTopics) throw new Error(topicsError?.message || 'Failed to create topics')

    // --- STEP 3: Generate Flashcards for each Topic ---
    // In a production app, this should be a background job. We'll do a single batched call here.
    const flashcardsPrompt = `
      Based on the following document, generate exactly 3 high-yield flashcards for each of these topics: ${insertedTopics.map((t: any) => t.topic_name).join(', ')}.
      Format as JSON:
      {
        "flashcards": [
          { "topic_name": "exact topic name from list", "question": "...", "answer": "..." }
        ]
      }
      Document Text: ${text.substring(0, 15000)}
    `
    const flashcardsJsonStr = await callGroq(flashcardsPrompt)
    const flashcardsData = JSON.parse(flashcardsJsonStr)

    const flashcardInserts = flashcardsData.flashcards.map((fc: any) => {
      const topic = insertedTopics.find((t: any) => t.topic_name.toLowerCase() === fc.topic_name.toLowerCase())
      return {
        user_id: user.id,
        topic_id: topic ? topic.id : insertedTopics[0].id, // fallback to first topic
        question: fc.question,
        answer: fc.answer,
        next_review_date: new Date().toISOString() // Due immediately
      }
    })

    const { error: fcError } = await supabaseAdmin
      .from('flashcards')
      .insert(flashcardInserts)

    if (fcError) console.error("Flashcard insert error:", fcError)

    return NextResponse.json({ success: true, examId: examData.id })

  } catch (error: any) {
    console.error('Process Exam Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
