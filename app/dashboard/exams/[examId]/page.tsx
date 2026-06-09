'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, ArrowLeft, Target, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import { Exam, Topic, Flashcard } from '@/types/database'

export default function ExamDetail() {
  const params = useParams()
  const examId = params.examId as string
  const [exam, setExam] = useState<Exam | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchExamData = async () => {
      // 1. Fetch Exam
      const { data: examData } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single()
      
      if (examData) setExam(examData)

      // 2. Fetch Topics
      const { data: topicsData } = await supabase
        .from('topics')
        .select('*')
        .eq('exam_id', examId)
        .order('exam_weight_percentage', { ascending: false })
      
      if (topicsData) setTopics(topicsData)

      // 3. Fetch Flashcards (via topics)
      if (topicsData && topicsData.length > 0) {
        const topicIds = topicsData.map(t => t.id)
        const { data: cardsData } = await supabase
          .from('flashcards')
          .select('*')
          .in('topic_id', topicIds)
        
        if (cardsData) setFlashcards(cardsData)
      }

      setLoading(false)
    }

    fetchExamData()
  }, [examId])

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
  }

  if (!exam) return <div>Exam not found</div>

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/exams">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{exam.exam_name}</h2>
          <p className="text-sm text-muted-foreground">{exam.filename}</p>
        </div>
        <div className="ml-auto">
          <Link href="/dashboard/practice">
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Zap className="mr-2 h-4 w-4" />
              Practice Now
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="8020plan" className="w-full">
        <TabsList className="bg-gray-900 border border-gray-800 p-1 mb-6">
          <TabsTrigger value="8020plan" className="data-[state=active]:bg-blue-600">The 80/20 Plan</TabsTrigger>
          <TabsTrigger value="flashcards" className="data-[state=active]:bg-blue-600">Generated Flashcards ({flashcards.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="8020plan" className="space-y-6 animate-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((topic, i) => (
              <Card key={topic.id} className="bg-gray-900 border-gray-800 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="bg-gray-800 border-gray-700">Topic {i + 1}</Badge>
                    <Badge variant="secondary" className={
                      topic.exam_weight_percentage > 20 ? "bg-red-900/30 text-red-400" : 
                      topic.exam_weight_percentage > 10 ? "bg-yellow-900/30 text-yellow-400" : 
                      "bg-blue-900/30 text-blue-400"
                    }>
                      {topic.exam_weight_percentage}% Weight
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3 leading-tight">{topic.topic_name}</CardTitle>
                </CardHeader>
                <CardContent className="mt-auto pt-4 border-t border-gray-800 flex justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Est. {topic.lecture_hours}h study
                  </div>
                  <div className="flex items-center text-blue-400 font-medium">
                    <Target className="mr-1 h-4 w-4" />
                    {flashcards.filter(f => f.topic_id === topic.id).length} cards
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="flashcards" className="space-y-4 animate-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card) => (
              <Card key={card.id} className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <Badge variant="outline" className="w-fit mb-2 text-xs text-gray-500 border-gray-700">
                    {topics.find(t => t.id === card.topic_id)?.topic_name}
                  </Badge>
                  <CardTitle className="text-md leading-relaxed">Q: {card.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-gray-800/50 rounded-md border border-gray-700 mt-2">
                    <span className="text-sm font-semibold text-green-400 mb-1 block">A:</span>
                    <p className="text-sm text-gray-300">{card.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
