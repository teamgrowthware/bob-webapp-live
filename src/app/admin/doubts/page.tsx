"use client";

import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, AlertCircle, Search, User, GraduationCap, ChevronRight, UserCheck } from "lucide-react";

export default function DoubtOversightPage() {
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null);
  const [correction, setCorrection] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    const res = await fetch("/api/teacher/doubts");
    if (res.ok) setDoubts(await res.json());
    setLoading(false);
  };

  const verifyDoubt = async (id: string, verified: boolean) => {
    setUpdating(true);
    const res = await fetch("/api/teacher/doubts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, verified, teacherCorrection: correction }),
    });
    if (res.ok) {
      setSelectedDoubt(null);
      setCorrection("");
      fetchDoubts();
    }
    setUpdating(false);
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-5xl font-black tracking-tight text-white italic">DOUBT OVERSIGHT</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs mt-2 ml-1">AI Answer Verification & Quality Control</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Doubt List */}
        <div className="space-y-4">
          <h2 className="text-white font-black uppercase italic tracking-widest text-xs flex items-center gap-2 mb-6">
            <AlertCircle size={14} className="text-amber-500" />
            Recent Queries ({doubts.filter(d => d.status === "UNVERIFIED").length} Unverified)
          </h2>
          {doubts.map((doubt) => (
            <div 
              key={doubt.id} 
              onClick={() => { setSelectedDoubt(doubt); setCorrection(doubt.teacherCorrection || ""); }}
              className={`p-6 bg-zinc-900 border border-zinc-800 rounded-3xl cursor-pointer hover:border-white/20 transition-all ${selectedDoubt?.id === doubt.id ? "border-white/30 bg-zinc-800/50" : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
                    <User size={18} className="text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-white font-black text-xs uppercase tracking-tight leading-none">{doubt.user.name}</p>
                    <p className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest mt-1">Class {doubt.user.class} • {doubt.user.school}</p>
                  </div>
                </div>
                {doubt.status === "VERIFIED" ? (
                  <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md text-[8px] font-black uppercase border border-emerald-500/20">Verified</span>
                ) : doubt.status === "FLAGGED" ? (
                  <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md text-[8px] font-black uppercase border border-rose-500/20">Flagged</span>
                ) : (
                  <span className="text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md text-[8px] font-black uppercase border border-amber-500/20">Pending</span>
                )}
              </div>
              <p className="text-zinc-300 font-bold text-sm leading-relaxed truncate">{doubt.question}</p>
            </div>
          ))}
        </div>

        {/* Verification Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 h-fit sticky top-10">
          {selectedDoubt ? (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div>
                 <label className="text-zinc-600 font-black text-[10px] uppercase tracking-widest mb-4 block">Student Question</label>
                 <div className="p-6 bg-zinc-950 rounded-3xl border border-zinc-800 italic text-white font-medium">
                    "{selectedDoubt.question}"
                 </div>
              </div>

              <div>
                 <label className="text-zinc-600 font-black text-[10px] uppercase tracking-widest mb-4 block">AI Generated Answer</label>
                 <div className="p-6 bg-violet-600/5 rounded-3xl border border-violet-500/20 text-zinc-300 text-sm leading-relaxed">
                    {selectedDoubt.aiAnswer}
                 </div>
              </div>

              <div>
                 <label className="text-zinc-600 font-black text-[10px] uppercase tracking-widest mb-4 block">Teacher Correction / Note</label>
                 <textarea 
                    value={correction}
                    onChange={e => setCorrection(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-white text-sm font-bold min-h-[120px] outline-none focus:border-white transition-all"
                    placeholder="Add feedback or fix AI errors..."
                 />
              </div>

              <div className="flex gap-4">
                 <button 
                   onClick={() => verifyDoubt(selectedDoubt.id, false)}
                   className="flex-1 bg-zinc-800 h-16 rounded-2xl font-black uppercase italic text-rose-500 border border-rose-500/10 hover:bg-rose-500/10 transition-all"
                 >
                   Flag as Incorrect
                 </button>
                 <button 
                   onClick={() => verifyDoubt(selectedDoubt.id, true)}
                   className="flex-2 bg-emerald-600 h-16 rounded-2xl font-black uppercase italic text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3"
                 >
                   <UserCheck size={20} />
                   Approve & Verify
                 </button>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-zinc-950 rounded-[28px] flex items-center justify-center border border-zinc-800 mb-6">
                 <MessageSquare size={32} className="text-zinc-700" />
               </div>
               <h3 className="text-zinc-500 font-black uppercase italic tracking-tighter text-xl">Select a query to verify</h3>
               <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mt-2">Help the AI learn from the masters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
