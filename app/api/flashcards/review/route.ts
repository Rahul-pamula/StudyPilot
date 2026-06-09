import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { calculateNextReview } from '@/lib/utils/spaced-repetition'

export async function POST(req: Request) {
  try {
    const { flashcardId, rating } = await req.json()
    
    if (!flashcardId || !['again', 'hard', 'easy'].includes(rating)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const { createServerClient } = require('@supabase/ssr')
    const { cookies } = require('next/headers')
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get(name: string) { return cookieStore.get(name)?.value } } }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabaseAdmin = createAdminClient()

    // Get current flashcard state
    const { data: card, error: fetchError } = await supabaseAdmin
      .from('flashcards')
      .select('*')
      .eq('id', flashcardId)
      .single()

    if (fetchError || !card) throw new Error('Flashcard not found')
    if (card.user_id !== user.id) throw new Error('Unauthorized')

    // Calculate next review based on SM-2
    const { nextReviewDate, newRepetitions, newEaseFactor } = calculateNextReview(
      {
        repetitions: card.repetitions,
        easeFactor: card.ease_factor,
        lastReviewDate: card.last_review_date ? new Date(card.last_review_date) : null
      },
      rating as any
    )

    // Update Flashcard
    const { error: updateError } = await supabaseAdmin
      .from('flashcards')
      .update({
        repetitions: newRepetitions,
        ease_factor: newEaseFactor,
        last_review_date: new Date().toISOString(),
        next_review_date: nextReviewDate.toISOString()
      })
      .eq('id', flashcardId)

    if (updateError) throw updateError

    // Log study session
    await supabaseAdmin
      .from('study_sessions')
      .insert({
        user_id: user.id,
        flashcard_id: flashcardId,
        rating,
        response_time_ms: 0 // Optional tracking
      })

    return NextResponse.json({ success: true, nextReviewDate })

  } catch (error: any) {
    console.error('Review API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
