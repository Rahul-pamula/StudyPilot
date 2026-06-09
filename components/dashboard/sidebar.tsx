'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, Library, Target, User, Brain } from 'lucide-react'
import { cn } from '@/lib/utils/helpers'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/upload', label: 'Upload Exam', icon: Upload },
  { href: '/dashboard/exams', label: 'My Exams', icon: Library },
  { href: '/dashboard/practice', label: 'Practice', icon: Target },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800">
      <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-800">
        <Brain className="h-7 w-7 text-blue-500" />
        <span className="font-bold text-xl tracking-tight">StudyPilot</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-500/10 text-blue-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-blue-500" : "text-gray-500")} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-xl p-4 text-center">
          <Target className="h-6 w-6 text-blue-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-blue-300">Pro Tip</p>
          <p className="text-xs text-gray-400 mt-1">Review your flashcards daily to maximize retention.</p>
        </div>
      </div>
    </aside>
  )
}
