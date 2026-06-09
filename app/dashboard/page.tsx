'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Brain, Target, Flame, ChevronRight, UploadCloud } from 'lucide-react'
import Link from 'next/link'

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    examsAnalyzed: 0,
    flashcardsToReview: 0,
    retentionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Fetch exam count
        const { count: examCount } = await supabase
          .from('exams')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Fetch due flashcards (due today or earlier)
        const today = new Date().toISOString()
        const { count: dueCards } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lte('next_review_date', today)

        setStats({
          examsAnalyzed: examCount || 0,
          flashcardsToReview: dueCards || 0,
          retentionRate: 85, // Mocked for initial setup, would be calculated from study_sessions
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground mt-1">Here is your academic command center.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Flashcards Due</CardTitle>
            <Brain className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '-' : stats.flashcardsToReview}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs your attention today</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Exams Analyzed</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '-' : stats.examsAnalyzed}</div>
            <p className="text-xs text-muted-foreground mt-1">Total materials processed</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Retention Rate</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '-' : `${stats.retentionRate}%`}</div>
            <Progress value={stats.retentionRate} className="h-1 mt-3" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>What you should focus on right now</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.flashcardsToReview > 0 ? (
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div>
                  <p className="font-semibold text-yellow-400">Review Session</p>
                  <p className="text-sm text-gray-400">You have {stats.flashcardsToReview} cards due.</p>
                </div>
                <Link href="/dashboard/practice">
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">Start</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div>
                  <p className="font-semibold text-blue-400">Upload Material</p>
                  <p className="text-sm text-gray-400">You're all caught up! Analyze a new exam.</p>
                </div>
                <Link href="/dashboard/upload">
                  <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-950">Upload</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 border-dashed flex flex-col items-center justify-center text-center p-8">
          <UploadCloud className="h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-200">Need more materials?</h3>
          <p className="text-sm text-gray-400 mt-2 mb-6 max-w-[250px]">
            Upload your latest past papers or syllabi to generate new study plans.
          </p>
          <Link href="/dashboard/upload">
            <Button>Upload Exam</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
