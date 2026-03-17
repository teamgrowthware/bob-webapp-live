"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, User as UserIcon, Loader2 } from "lucide-react";
// @ts-ignore
import ReactMarkdown from "react-markdown";

export default function DoubtsClient({ initialDoubts }: { initialDoubts: any[] }) {
  const [doubts, setDoubts] = useState(initialDoubts);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ai/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();

      if (res.ok) {
        setDoubts([data.doubt, ...doubts]);
        setQuestion("");
      } else {
        alert(data.error || "Failed to get an answer.");
      }
    } catch {
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-2xl">
          <Bot className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">AI Doubt Portal</h1>
          <p className="text-zinc-400 mt-1">Stuck on a tricky concept? Ask our 24/7 AI Tutor!</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-6">
          <div className="relative">
            <Textarea
              placeholder="E.g., Why do we have leap years? Explain it simply."
              className="bg-zinc-950 border-zinc-800 min-h-[120px] text-white resize-none pr-16"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={!question.trim() || loading}
              className="absolute bottom-4 right-4 p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Previous Explanations</h2>
        {doubts.length === 0 && <p className="text-zinc-500 italic">No doubts asked yet. Don't be shy!</p>}
        {doubts.map((d) => (
          <div key={d.id} className="space-y-4">
            {/* Student Question Bubble */}
            <div className="flex gap-4 justify-end">
              <div className="bg-indigo-500/20 text-indigo-100 p-4 rounded-2xl rounded-tr-sm max-w-[80%] border border-indigo-500/30">
                <p className="font-medium whitespace-pre-wrap">{d.question}</p>
              </div>
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-zinc-800 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-zinc-400" />
              </div>
            </div>

            {/* AI Answer Bubble */}
            <div className="flex gap-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-zinc-900 text-zinc-300 p-6 rounded-2xl rounded-tl-sm w-full border border-zinc-800 prose prose-invert prose-indigo max-w-none">
                {d.teacherCorrection ? (
                  <>
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">
                      Teacher Overridden
                    </div>
                    <ReactMarkdown>{d.teacherCorrection}</ReactMarkdown>
                  </>
                ) : (
                  <ReactMarkdown>{d.aiResponse}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
