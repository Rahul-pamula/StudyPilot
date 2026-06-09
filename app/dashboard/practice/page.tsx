'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FlashcardView } from '@/components/flashcards/flashcard'
import { Flashcard } from '@/types/database'
import { Loader2, CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PracticePage() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchDueCards = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString()
      
      const { data } = await supabase
        .from('flashcards')
        .select('*, topic:topics(topic_name)')
        .eq('user_id', user.id)
        .lte('next_review_date', today)
        .order('next_review_date', { ascending: true })
        .limit(20)

      if (data) setCards(data as any)
      setLoading(false)
    }

    fetchDueCards()
  }, [])

  const handleRate = async (rating: 'again' | 'hard' | 'easy') => {
    const card = cards[currentIndex]
    
    // Fire and forget rating to backend
    fetch('/api/flashcards/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flashcardId: card.id, rating })
    })

    // Move to next card
    setCurrentIndex(prev => prev + 1)
  }

  if (loading) {
    return <div className="flex h-[70vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
  }

  if (cards.length === 0 || currentIndex >= cards.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">You're all caught up!</h2>
        <p className="text-gray-400 max-w-md mb-8">You've completed all your due reviews for today. Your brain is officially optimized.</p>
        <Link href="/dashboard">
          <Button className="bg-gray-800 hover:bg-gray-700">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const currentCard = cards[currentIndex]

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center pt-8 animate-fade-in">
      <div className="w-full flex justify-between items-center mb-12">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="text-yellow-500 h-6 w-6" /> Daily Review
          </h2>
          <p className="text-sm text-gray-400">Card {currentIndex + 1} of {cards.length}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-800">
            {cards.length - currentIndex} remaining
          </span>
        </div>
      </div>

      <FlashcardView 
        key={currentCard.id} // Force remount on card change for flip reset
        question={currentCard.question}
        answer={currentCard.answer}
        topic={(currentCard as any).topic?.topic_name}
        onRate={handleRate}
      />
    </div>
  )
}
