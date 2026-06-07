"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, FileText, Calendar, Home, LogOut, ChevronRight, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",            label: "Home",       icon: Home },
  { href: "/dashboard/chat",       label: "Chat",       icon: MessageSquare },
  { href: "/dashboard/summarizer", label: "Summarize",  icon: FileText },
  { href: "/dashboard/planner",    label: "Planner",    icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">✈</div>
          <span className="font-bold text-slate-900 text-lg">StudyPilot</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon size={16} />
              {label}
              {active && <ChevronRight size={14} className="ml-auto text-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-slate-200 space-y-1">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-slate-200">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
            {user?.username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
