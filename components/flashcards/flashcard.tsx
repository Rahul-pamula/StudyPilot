'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/helpers'
import { RotateCw } from 'lucide-react'

interface FlashcardProps {
  question: string
  answer: string
  topic?: string
  onRate?: (rating: 'again' | 'hard' | 'easy') => void
}

export function FlashcardView({ question, answer, topic, onRate }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto perspective-1000">
      <div 
        className={cn(
          "relative w-full h-[400px] transition-all duration-500 transform-style-3d cursor-pointer shadow-xl",
          flipped ? "rotate-y-180" : ""
        )}
        onClick={() => !flipped && setFlipped(true)}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden bg-gray-900 border-gray-700 flex flex-col justify-center items-center p-8 text-center hover:border-gray-500 transition-colors">
          {topic && <span className="absolute top-6 left-6 text-xs font-medium text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">{topic}</span>}
          <h3 className="text-2xl font-medium text-gray-100 leading-relaxed">{question}</h3>
          <div className="absolute bottom-6 flex items-center text-gray-500 text-sm">
            <RotateCw className="mr-2 h-4 w-4" />
            Click to reveal answer
          </div>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 bg-gray-800 border-blue-900 flex flex-col p-8 text-center justify-between">
          <div className="flex-1 flex items-center justify-center overflow-y-auto">
            <p className="text-lg text-gray-200 leading-relaxed">{answer}</p>
          </div>
          
          {onRate && (
            <div className="mt-8 pt-6 border-t border-gray-700 flex justify-center gap-4">
              <Button 
                variant="destructive" 
                className="w-24 bg-red-950/50 text-red-400 border border-red-900 hover:bg-red-900"
                onClick={(e) => { e.stopPropagation(); onRate('again'); setFlipped(false); }}
              >
                Again (1d)
              </Button>
              <Button 
                variant="outline" 
                className="w-24 bg-orange-950/50 text-orange-400 border border-orange-900 hover:bg-orange-900"
                onClick={(e) => { e.stopPropagation(); onRate('hard'); setFlipped(false); }}
              >
                Hard
              </Button>
              <Button 
                className="w-24 bg-green-950/50 text-green-400 border border-green-900 hover:bg-green-900"
                onClick={(e) => { e.stopPropagation(); onRate('easy'); setFlipped(false); }}
              >
                Easy
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
