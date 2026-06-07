import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps { text: string; role: "user" | "assistant"; }

export function ChatBubble({ text, role }: ChatBubbleProps) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
        isUser ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
      )}>
        {isUser ? "U" : "AI"}
      </div>
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
        isUser
          ? "bg-blue-600 text-white rounded-tr-sm"
          : "bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-sm"
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
