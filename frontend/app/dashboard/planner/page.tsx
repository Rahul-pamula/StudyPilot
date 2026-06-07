"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Plus, Trash2, Calendar } from "lucide-react";

interface PlanItem { id: string; title: string; has_schedule: boolean; }
interface Session {
  session: number; start: string; end: string; subject: string;
  is_weak: boolean; break_len: number; resume: string;
}

const moodColors: Record<string, { bg: string; border: string; text: string }> = {
  positive: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  neutral:  { bg: "bg-blue-50",    border: "border-blue-200",    text: "text-blue-700" },
  negative: { bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700" },
};

export default function PlannerPage() {
  const [list, setList]           = useState<PlanItem[]>([]);
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [plan, setPlan]           = useState<Record<string, unknown> | null>(null);
  const [subjects, setSubjects]   = useState("");
  const [weak, setWeak]           = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime]     = useState("12:00");
  const [mood, setMood]           = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => { loadList(); }, []);
  useEffect(() => { if (activeId) loadPlan(activeId); }, [activeId]);

  const loadList = async () => {
    const data = await api.plans.list();
    setList(data);
    if (data.length > 0 && !activeId) setActiveId(data[0].id);
  };

  const loadPlan = async (id: string) => {
    const data = await api.plans.get(id) as Record<string, unknown>;
    setPlan(data);
    setSubjects((data.subjects as string) || "");
    setWeak((data.weak as string) || "");
    setMood((data.mood as string) || "");
  };

  const newPlan = async () => {
    const data = await api.plans.create() as Record<string, unknown>;
    setActiveId(data.id as string);
    setPlan(null); setSubjects(""); setWeak(""); setMood("");
    await loadList();
  };

  const deletePlan = async (id: string) => {
    await api.plans.delete(id);
    const rem = list.filter(p => p.id !== id);
    setList(rem);
    if (activeId === id) { setActiveId(rem[0]?.id ?? null); setPlan(null); }
  };

  const generate = async () => {
    if (!activeId) return;
    setLoading(true);
    try {
      const data = await api.plans.generate(activeId, subjects, weak, startTime, endTime, mood) as Record<string, unknown>;
      setPlan(data);
      await loadList();
    } finally { setLoading(false); }
  };

  const schedule = (plan?.schedule as Session[]) || [];
  const moodCat  = (plan?.mood_cat as string) || "neutral";
  const colors   = moodColors[moodCat] || moodColors.neutral;

  return (
    <div className="flex gap-6">
      {/* List sidebar */}
      <div className="w-52 shrink-0 flex flex-col gap-2">
        <button onClick={newPlan} className="flex items-center gap-2 text-sm text-blue-600 font-medium border border-dashed border-blue-300 rounded-xl px-3 py-2 hover:bg-blue-50 transition-colors">
          <Plus size={14} /> New Plan
        </button>
        <div className="overflow-y-auto flex-1 space-y-1">
          {list.map(p => (
            <div key={p.id}
              className={`group flex items-center gap-1 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${activeId === p.id ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-100"}`}
              onClick={() => setActiveId(p.id)}>
              <span className="flex-1 truncate">{p.title}</span>
              <button onClick={e => { e.stopPropagation(); deletePlan(p.id); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 space-y-5">
        <PageHeader title="📅 Adaptive Planner" subtitle="Generate study schedules that adapt to your mood and energy level." />

        {/* Setup card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-slate-900 text-sm">Schedule Setup</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Subjects (comma-separated)</label>
              <input value={subjects} onChange={e => setSubjects(e.target.value)} placeholder="Python, ML, DSA"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Weak subject</label>
              <input value={weak} onChange={e => setWeak(e.target.value)} placeholder="ML"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Start time</label>
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">End time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">How are you feeling right now?</label>
            <input value={mood} onChange={e => setMood(e.target.value)} placeholder="I feel tired and stressed today…"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
          </div>
          <button onClick={generate} disabled={loading || !subjects.trim()}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Calendar size={15} />
            {loading ? "Generating…" : "Generate Schedule"}
          </button>
        </div>

        {/* Results */}
        {schedule.length > 0 && plan && (
          <div className="space-y-4">
            {/* Mood check-in */}
            <div className={`${colors.bg} ${colors.border} border rounded-2xl p-4`}>
              <p className={`${colors.text} font-semibold text-sm mb-1`}>
                {moodCat === "positive" ? "🌟" : moodCat === "negative" ? "💙" : "🎯"} Mood Check-in
              </p>
              <p className={`${colors.text} text-sm`}>{plan.checkin as string}</p>
            </div>

            {/* Motivation */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 border-l-4 border-l-amber-400">
              <p className="text-amber-800 font-semibold text-sm mb-1">✨ Your Motivation</p>
              <p className="text-amber-700 text-sm italic">&quot;{plan.boost as string}&quot;</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Sessions", value: schedule.length, color: "text-blue-600" },
                { label: "Total Minutes", value: plan.total_minutes as number, color: "text-emerald-600" },
                { label: "Break Mins", value: schedule[0]?.break_len, color: "text-amber-600" },
              ].map(stat => (
                <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
                  <p className={`${stat.color} text-xl font-bold`}>{stat.value}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Schedule table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">📋 Your Schedule</h3>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-medium">
                  <tr>
                    {["#", "Start", "End", "Subject", "Break"].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((s, i) => (
                    <tr key={i} className={`border-t border-slate-100 ${s.is_weak ? "bg-amber-50" : ""}`}>
                      <td className="px-4 py-2.5 text-slate-400 text-xs">#{s.session}</td>
                      <td className="px-4 py-2.5 text-blue-600 font-medium">{s.start}</td>
                      <td className="px-4 py-2.5 text-blue-600 font-medium">{s.end}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        {s.subject}
                        {s.is_weak && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">WEAK</span>}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">☕ {s.break_len}m → {s.resume}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {moodCat === "negative" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-700 font-semibold text-sm mb-1">💙 A Note For You</p>
                <p className="text-red-600 text-sm leading-relaxed">It&apos;s okay to not be okay. Even completing one session today is a win. Your mental health always comes first. 🤍</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
