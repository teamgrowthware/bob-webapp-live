"use client";

import { useEffect, useState } from "react";
import { Plus, Swords, Calendar, Eye, Trash2, Edit } from "lucide-react";

export default function QuizzesAdmin() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/quizzes")
      .then(res => res.json())
      .then(data => {
        setQuizzes(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Strategic Depot</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Manage the Battle Question bank</p>
        </div>
        <button className="bg-violet-600 hover:bg-violet-500 text-white font-black px-6 py-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-violet-600/20 uppercase tracking-tight italic">
           <Plus size={20} /> Deploy New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
             <div className="col-span-full py-20 text-center font-black italic text-zinc-700 uppercase">Loading Armory...</div>
        ) : quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-zinc-900/40 border border-zinc-900 rounded-[32px] p-8 flex flex-col justify-between group hover:border-violet-500/30 transition-all duration-500 relative overflow-hidden">
             {quiz.title.includes("[DAILY]") && (
                <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black px-4 py-1 skew-x-[-20deg] mr-[-10px]">DAILY ACTIVE</div>
             )}
             
             <div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                      <Swords size={16} className="text-violet-500" />
                   </div>
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{quiz.category} • {quiz.difficulty}</span>
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2 line-clamp-1">{quiz.title.replace("[DAILY]", "").trim()}</h3>
                <p className="text-zinc-500 font-bold text-xs uppercase mb-6">{quiz.questions?.length || 0} Critical Vectors (Questions)</p>
             </div>

             <div className="flex gap-2 pt-6 border-t border-zinc-900/50">
                <button className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                   <Eye size={14} /> <span className="text-[10px] font-black uppercase">Inspect</span>
                </button>
                <button className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                   <Calendar size={14} /> <span className="text-[10px] font-black uppercase">Schedule</span>
                </button>
                <button className="p-3 bg-zinc-950 border border-zinc-800 text-zinc-700 hover:text-red-500 transition-all rounded-xl">
                   <Trash2 size={14} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
