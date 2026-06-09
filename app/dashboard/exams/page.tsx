'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, ChevronRight, Calendar } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/helpers'
import { Exam } from '@/types/database'

export default function ExamsList() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchExams = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('exams')
        .select('*, topics(count)')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })

      if (data) {
        setExams(data as any)
      }
      setLoading(false)
    }

    fetchExams()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Exams</h2>
        <p className="text-muted-foreground mt-1">All your analyzed materials and study plans.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-gray-900 border-gray-800 h-32 animate-pulse" />
          ))}
        </div>
      ) : exams.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800 border-dashed text-center p-12">
          <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300">No exams yet</h3>
          <p className="text-gray-500 mt-1 mb-4">Upload a past paper to get started.</p>
          <Link href="/dashboard/upload" className="text-blue-500 hover:underline">Go to Upload</Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <Link key={exam.id} href={`/dashboard/exams/${exam.id}`}>
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-600 transition-colors cursor-pointer h-full flex flex-col group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                      {exam.exam_name}
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(exam.upload_date)}
                  </div>
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/50">
                    {(exam as any).topics?.[0]?.count || 0} Topics
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
