"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { ChatBubble } from "@/components/ChatBubble";
import { PageHeader } from "@/components/PageHeader";
import { Plus, Send, Trash2 } from "lucide-react";

interface Message { role: "user" | "assistant"; text: string; }
interface ChatItem { id: string; label: string; message_count: number; }

export default function ChatPage() {
  const [chats, setChats]         = useState<ChatItem[]>([]);
  const [activeChatId, setActive] = useState<string | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [sending, setSending]     = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadChats(); }, []);
  useEffect(() => { if (activeChatId) loadMessages(activeChatId); }, [activeChatId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadChats = async () => {
    setLoading(true);
    try {
      const data = await api.chats.list();
      setChats(data);
      if (data.length > 0 && !activeChatId) setActive(data[0].id);
    } finally { setLoading(false); }
  };

  const loadMessages = async (id: string) => {
    const data = await api.chats.get(id);
    setMessages(data.messages as Message[]);
  };

  const newChat = async () => {
    const chat = await api.chats.create();
    setActive(chat.id);
    setMessages([]);
    await loadChats();
  };

  const deleteChat = async (id: string) => {
    await api.chats.delete(id);
    const remaining = chats.filter(c => c.id !== id);
    setChats(remaining);
    if (activeChatId === id) {
      setActive(remaining[0]?.id ?? null);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeChatId || sending) return;
    const msg = input.trim();
    setInput("");
    setSending(true);
    setMessages(prev => [...prev, { role: "user", text: msg }]);
    try {
      const res = await api.chats.send(activeChatId, msg);
      setMessages(res.messages as Message[]);
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, label: msg.slice(0, 40) + "…", message_count: res.messages.length } : c));
    } finally { setSending(false); }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-4rem)]">
      {/* Chat List Sidebar */}
      <div className="w-52 shrink-0 flex flex-col gap-2">
        <button onClick={newChat} className="flex items-center gap-2 text-sm text-blue-600 font-medium border border-dashed border-blue-300 rounded-xl px-3 py-2 hover:bg-blue-50 transition-colors">
          <Plus size={14} /> New Chat
        </button>
        <div className="overflow-y-auto flex-1 space-y-1">
          {chats.map(c => (
            <div
              key={c.id}
              className={`group flex items-center gap-1 px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${activeChatId === c.id ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-100"}`}
              onClick={() => setActive(c.id)}
            >
              <span className="flex-1 truncate">{c.label}</span>
              <button onClick={e => { e.stopPropagation(); deleteChat(c.id); }} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all">
                <Trash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <PageHeader title="💬 Ask Anything" subtitle="Technical questions on Python, ML, algorithms, and more." />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 chat-scroll">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 text-sm mt-16">
              <div className="text-3xl mb-3">💬</div>
              <p>Ask a question to get started.</p>
              <p className="text-xs mt-1">Try: &quot;Explain recursion with an example&quot;</p>
            </div>
          )}
          {messages.map((msg, i) => <ChatBubble key={i} text={msg.text} role={msg.role} />)}
          {sending && (
            <div className="flex gap-3 mb-4">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold shrink-0">AI</div>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="w-2 h-2 bg-slate-400 rounded-full"
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Fixed input bar */}
        <div className="px-5 py-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2.5">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask a technical question…"
              className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
