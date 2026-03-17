"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Check, Flag, Loader2 } from "lucide-react";
// @ts-ignore
import ReactMarkdown from "react-markdown";

export default function TeacherDoubtsClient({ initialDoubts }: { initialDoubts: any[] }) {
  const [doubts, setDoubts] = useState(initialDoubts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = async (id: string, status: string) => {
    setLoadingId(id);
    const teacherCorrection = corrections[id];

    try {
      const res = await fetch("/api/admin/doubts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doubtId: id, status, teacherCorrection: status === 'FLAGGED' ? teacherCorrection : undefined }),
      });
      const data = await res.json();

      if (res.ok) {
        setDoubts(doubts.map(d => d.id === id ? data.doubt : d));
        setEditingId(null);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Network Error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {doubts.map((d) => (
        <Card key={d.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardContent className="p-0">
            {/* Header / Student Info */}
            <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">{d.user.name} <span className="text-zinc-500 font-normal">({d.user.class})</span></p>
                <p className="text-xs text-zinc-500">{d.user.school}</p>
              </div>
              <div className={`px-3 py-1 text-xs font-bold rounded-full border ${d.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                d.status === 'FLAGGED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}>
                {d.status}
              </div>
            </div>

            {/* Q&A Content */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Student Asked:</h4>
                <p className="text-white font-medium text-lg leading-relaxed">{d.question}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Gemini's Answer:</h4>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 prose prose-invert prose-emerald max-w-none text-zinc-300">
                  <ReactMarkdown>{d.aiResponse}</ReactMarkdown>
                </div>
              </div>

              {/* Correction Section */}
              {editingId === d.id && d.status !== 'VERIFIED' ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Teacher Override:</h4>
                  <Textarea
                    value={corrections[d.id] ?? d.teacherCorrection ?? ""}
                    onChange={(e) => setCorrections({ ...corrections, [d.id]: e.target.value })}
                    className="bg-zinc-950 border-zinc-800 text-white min-h-[100px]"
                    placeholder="Type the corrected explanation here. You can use markdown."
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancel</button>
                    <button
                      onClick={() => handleUpdate(d.id, "FLAGGED")}
                      disabled={loadingId === d.id || !corrections[d.id]?.trim()}
                      className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-bold disabled:opacity-50"
                    >
                      {loadingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Override"}
                    </button>
                  </div>
                </div>
              ) : d.teacherCorrection && (
                <div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Teacher Override:</h4>
                  <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 prose prose-invert prose-amber max-w-none text-zinc-300">
                    <ReactMarkdown>{d.teacherCorrection}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {editingId !== d.id && d.status === 'UNVERIFIED' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
                  <button
                    onClick={() => handleUpdate(d.id, "VERIFIED")}
                    disabled={loadingId === d.id}
                    className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {loadingId === d.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Verify for FAQ</>}
                  </button>
                  <button
                    onClick={() => setEditingId(d.id)}
                    className="flex-1 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Flag className="w-4 h-4" /> Flag & Correct
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {doubts.length === 0 && (
        <p className="text-center text-zinc-500 py-12">No student doubts pending review.</p>
      )}
    </div>
  );
}
