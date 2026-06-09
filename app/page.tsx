'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Sparkles, Target, Zap, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      <header className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-500" />
          <span className="font-bold text-2xl tracking-tight">StudyPilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="hover:bg-gray-800">Log in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/20">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">The Academic OS powered by AI</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
          Study exactly what <span className="text-gradient">matters.</span> Nothing else.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
          Upload your past exams and lectures. Our AI extracts the 80/20 high-yield topics, builds smart flashcards, and plans your optimal study sessions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 group">
              Start Studying Free
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full animate-stagger">
          <FeatureCard 
            icon={<Target className="h-6 w-6 text-indigo-400" />}
            title="80/20 Topic Extraction"
            description="AI analyzes your past exams to figure out exactly which topics carry the most weight."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6 text-yellow-400" />}
            title="Auto Flashcards"
            description="Instantly generates Q&A pairs from your materials, formatted perfectly for rapid learning."
          />
          <FeatureCard 
            icon={<Brain className="h-6 w-6 text-blue-400" />}
            title="Spaced Repetition"
            description="The algorithm schedules your reviews exactly when your brain is about to forget."
          />
        </div>
      </main>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-6 text-left hover:-translate-y-1 transition-transform duration-300">
      <div className="bg-gray-800/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-gray-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-100">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
