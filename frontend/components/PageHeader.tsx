import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-500 mt-1 text-sm leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  );
}
