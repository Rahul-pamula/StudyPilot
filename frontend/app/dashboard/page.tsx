"use client";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { DashCard } from "@/components/FeatureCard";
import { MessageSquare, FileText, Calendar, Sparkles } from "lucide-react";

export default function DashboardHome() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <PageHeader
        title={`${greeting}, ${user?.username} 👋`}
        subtitle="What would you like to work on today?"
      />

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <DashCard href="/dashboard/chat"       title="AI Chat"          description="Ask technical questions and get structured, formatted answers."    icon={<MessageSquare size={18} />} />
        <DashCard href="/dashboard/summarizer" title="Notes Summarizer" description="Condense lectures and readings into clean, structured summaries."    icon={<FileText size={18} />} />
        <DashCard href="/dashboard/planner"    title="Study Planner"    description="Generate adaptive Pomodoro schedules tailored to your energy level." icon={<Calendar size={18} />} />
      </div>

      {/* Tips card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm mb-3">
          <Sparkles size={15} />
          Study Tips
        </div>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Consistent short sessions beat irregular marathon cramming every time.</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Tell the Planner how you&apos;re feeling — it adapts breaks to protect your energy.</li>
          <li className="flex items-start gap-2"><span className="text-blue-400 mt-0.5">•</span> Review summaries 24 hours later to lock in long-term memory retention.</li>
        </ul>
      </div>
    </div>
  );
}
