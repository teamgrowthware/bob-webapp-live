"use client";

import { useState, useEffect } from "react";
import { Users, Trophy, BookOpen, Clock, ChevronRight, UserMinus } from "lucide-react";
import { useParams } from "next/navigation";

export default function ClassDetails() {
  const params = useParams();
  const [classroom, setClassroom] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchClassDetails();
  }, []);

  const fetchClassDetails = async () => {
    const res = await fetch(`/api/teacher/classes/${params.id}`);
    if (res.ok) {
      setClassroom(await res.json());
    }
    
    // Also fetch available quizzes
    const quizRes = await fetch("/api/quizzes"); // Assuming this exists or create it
    if (quizRes.ok) {
      setQuizzes(await quizRes.json());
    }
    setLoading(false);
  };

  const assignQuiz = async () => {
    if (!selectedQuizId) return;
    setAssigning(true);
    const res = await fetch("/api/teacher/assignments", {
      method: "POST",
      body: JSON.stringify({
        classId: params.id,
        quizId: selectedQuizId,
        dueDate: dueDate || null
      }),
    });
    if (res.ok) {
      setShowAssignModal(false);
      setSelectedQuizId("");
      setDueDate("");
      fetchClassDetails();
    }
    setAssigning(false);
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading class intelligence...</div>;
  if (!classroom) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Classroom not found.</div>;

  return (
    <div className="min-h-screen bg-zinc-950 p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-violet-600/20 text-violet-400 font-mono font-black px-3 py-1 rounded-lg border border-violet-500/20 text-sm">{classroom.code}</span>
              <span className="text-zinc-600 font-black text-[10px] uppercase tracking-widest leading-none">Class Secret</span>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">{classroom.name}</h1>
          </div>
          <button 
            onClick={() => setShowAssignModal(true)}
            className="bg-violet-600 border border-violet-500/20 text-white px-6 py-3 rounded-2xl font-black uppercase italic hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20"
          >
             Assign Test
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-white text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
              <Users size={20} className="text-violet-500" />
              Squad Roster ({classroom.students.length})
            </h2>

            {classroom.students.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-12 text-center">
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No students have joined yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {classroom.students.map((enrollment: any) => {
                  const student = enrollment.student;
                  const recentAccuracy = student.attempts.length > 0
                    ? student.attempts.reduce((acc: number, cur: any) => acc + cur.accuracy, 0) / student.attempts.length
                    : 0;

                  return (
                    <div key={student.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-violet-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-zinc-800 rounded-2xl items-center justify-center flex font-black text-white italic text-xl border border-zinc-700">
                          {student.name?.[0] || "?"}
                        </div>
                        <div>
                          <h4 className="text-white font-black text-xl italic uppercase tracking-tight">{student.name}</h4>
                          <span className="text-zinc-600 font-black text-[10px] uppercase tracking-widest">Class {student.class} • {student.xp} XP</span>
                        </div>
                      </div>

                      <div className="flex gap-8">
                        <div className="flex flex-col items-end">
                           <span className={`text-xl font-black italic ${recentAccuracy >= 80 ? 'text-green-500' : recentAccuracy >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                             {recentAccuracy.toFixed(0)}%
                           </span>
                           <span className="text-zinc-600 font-black text-[8px] uppercase tracking-tighter">Avg Accuracy</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-white text-xl font-black italic">{student.attempts.length}</span>
                           <span className="text-zinc-600 font-black text-[8px] uppercase tracking-tighter">Quizzes Done</span>
                        </div>
                        <button className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/5 group/btn transition-all">
                           <UserMinus size={18} className="text-zinc-600 group-hover/btn:text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Assignments & Sidebar */}
          <div className="space-y-8">
             <div>
                <h2 className="text-white text-xl font-black italic uppercase tracking-tight mb-6 flex items-center gap-3">
                  <BookOpen size={20} className="text-violet-500" />
                  Active Missions
                </h2>
                <div className="space-y-4">
                   {classroom.assignments.length === 0 ? (
                     <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center border-dashed">
                        <p className="text-zinc-600 font-black text-[10px] uppercase tracking-widest leading-loose">No active assignments.<br/>Time to drop a mission.</p>
                     </div>
                   ) : (
                     classroom.assignments.map((assignment: any) => (
                        <div key={assignment.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 border-l-4 border-l-violet-600">
                           <h4 className="text-white font-black uppercase tracking-tight italic">{assignment.quiz.title}</h4>
                           <div className="flex items-center gap-2 mt-2">
                              <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">{assignment.quiz.subject}</span>
                              <span className="bg-zinc-950 text-zinc-500 text-[8px] px-2 py-0.5 rounded-full border border-zinc-800 font-black uppercase">
                                 Due {new Date(assignment.dueDate || Date.now()).toLocaleDateString()}
                              </span>
                           </div>
                        </div>
                     ))
                   )}
                </div>
             </div>

             <div className="bg-violet-600 p-8 rounded-[32px] shadow-2xl shadow-violet-600/30">
                <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter mb-2">Victory Tip</h3>
                <p className="text-violet-100 font-bold text-xs leading-relaxed opacity-90">
                  Students with over 80% accuracy are ready for "Battle Mode". Encourage them to compete for extra coins!
                </p>
             </div>
          </div>
        </div>
      </div>

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[40px] p-10 overflow-hidden relative">
            <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-8">Drop Mission</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 block">Select Quiz</label>
                <select 
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 h-16 text-white text-lg font-bold outline-none focus:border-violet-500 transition-all appearance-none"
                >
                  <option value="">Choose a quiz...</option>
                  {quizzes.map(q => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 block">Due Date (Optional)</label>
                <input 
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 h-16 text-white text-lg font-bold outline-none focus:border-violet-500 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase italic h-16 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={!selectedQuizId || assigning}
                  onClick={assignQuiz}
                  className="flex-2 bg-violet-600 hover:bg-violet-700 text-white font-black uppercase italic h-16 rounded-2xl transition-all disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
