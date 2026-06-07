"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { Plus, Trash2, Sparkles, Copy, Check } from "lucide-react";

interface SummaryItem { id: string; title: string; has_output: boolean; }

const formats = ["Plain Text", "Bullet Points", "Essay", "Letter", "Email"];

export default function SummarizerPage() {
  const [list, setList]           = useState<SummaryItem[]>([]);
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [text, setText]           = useState("");
  const [wordCount, setWordCount] = useState(80);
  const [format, setFormat]       = useState("Plain Text");
  const [output, setOutput]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);

  useEffect(() => { loadList(); }, []);
  useEffect(() => { if (activeId) loadItem(activeId); }, [activeId]);

  const loadList = async () => {
    const data = await api.summaries.list();
    setList(data);
    if (data.length > 0 && !activeId) setActiveId(data[0].id);
  };

  const loadItem = async (id: string) => {
    const data = await api.summaries.get(id);
    setText(data.text || "");
    setWordCount(data.word_count || 80);
    setFormat(data.format_style || "Plain Text");
    setOutput(data.summary || "");
  };

  const newSummary = async () => {
    const data = await api.summaries.create();
    setActiveId(data.id);
    setText(""); setOutput("");
    await loadList();
  };

  const deleteSummary = async (id: string) => {
    await api.summaries.delete(id);
    const rem = list.filter(s => s.id !== id);
    setList(rem);
    if (activeId === id) { setActiveId(rem[0]?.id ?? null); setText(""); setOutput(""); }
  };

  const generate = async () => {
    if (!activeId || text.trim().length < 20) return;
    setLoading(true);
    try {
      const data = await api.summaries.generate(activeId, text, wordCount, format);
      setOutput(data.summary);
      await loadList();
    } finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-6">
      {/* List sidebar */}
      <div className="w-52 shrink-0 flex flex-col gap-2">
        <button onClick={newSummary} className="flex items-center gap-2 text-sm text-blue-600 font-medium border border-dashed border-blue-300 rounded-xl px-3 py-2 hover:bg-blue-50 transition-colors">
          <Plus size={14} /> New Summary
        </button>
        <div className="overflow-y-auto flex-1 space-y-1">
          {list.map(s => (
            <div key={s.id}
              className={`group flex items-center gap-1 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${activeId === s.id ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-100"}`}
              onClick={() => setActiveId(s.id)}>
              <span className="flex-1 truncate">{s.title}</span>
              <button onClick={e => { e.stopPropagation(); deleteSummary(s.id); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-5">
        <PageHeader title="📝 Notes Summarizer" subtitle="Paste your lecture notes and generate structured, formatted summaries." />

        {/* Input card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1.5 block">Paste your notes</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your lecture transcript, textbook notes, or slides here…"
              rows={8}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
            />
            {text.trim() && <p className="text-xs text-slate-400 mt-1">{text.trim().split(/\s+/).length} words</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Target word count</label>
              <input type="number" value={wordCount} onChange={e => setWordCount(+e.target.value)} min={10} max={1000}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">Format</label>
              <select value={format} onChange={e => setFormat(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white">
                {formats.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <button onClick={generate} disabled={loading || text.trim().length < 20}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
            <Sparkles size={15} />
            {loading ? "Generating…" : "Generate Summary"}
          </button>
        </div>

        {/* Output card */}
        {output && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">Summary Output</h3>
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors">
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="prose prose-sm max-w-none prose-p:text-slate-700 prose-headings:text-slate-900 prose-li:text-slate-700">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">{output}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
