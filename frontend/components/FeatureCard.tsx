import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeatureCardProps { icon: React.ReactNode; title: string; description: string; }

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 text-base mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface DashCardProps { title: string; description: string; icon: React.ReactNode; href: string; }

export function DashCard({ title, description, icon, href }: DashCardProps) {
  return (
    <Link href={href} className="block bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
    </Link>
  );
}
