"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Code, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await fetch("/api/teacher/classes");
    if (res.ok) {
      setClasses(await res.json());
    }
    setLoading(false);
  };

  const createClass = async () => {
    if (!newClassName) return;
    const res = await fetch("/api/teacher/classes", {
      method: "POST",
      body: JSON.stringify({ name: newClassName }),
    });
    if (res.ok) {
      setNewClassName("");
      setShowModal(false);
      fetchClasses();
    }
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Teacher Hub</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Classroom Management</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-2xl font-black uppercase italic flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-violet-600/20"
          >
            <Plus size={20} />
            Create Class
          </button>
        </div>

        {classes.length === 0 ? (
          <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-[40px] p-20 text-center">
            <div className="bg-zinc-900 w-20 h-20 rounded-3xl items-center justify-center flex mx-auto mb-6">
               <GraduationCap size={40} className="text-zinc-700" />
            </div>
            <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter">No classes yet</h3>
            <p className="text-zinc-500 mt-2 max-w-sm mx-auto">Create a class to start assigning quizzes and tracking your students' performance.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <Link 
                key={cls.id} 
                href={`/teacher/class/${cls.id}`}
                className="group bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 hover:border-violet-500/50 transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-violet-600/20 w-14 h-14 rounded-2xl items-center justify-center flex border border-violet-500/20">
                     <Users size={24} className="text-violet-400" />
                  </div>
                  <div className="bg-zinc-950 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2">
                     <Code size={14} className="text-zinc-500" />
                     <span className="text-zinc-300 font-mono font-bold text-sm tracking-wider">{cls.code}</span>
                  </div>
                </div>
                
                <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter group-hover:text-violet-400 transition-colors">{cls.name}</h3>
                <div className="mt-8 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-white text-xl font-bold">{cls._count.students}</span>
                      <span className="text-zinc-600 font-black text-[10px] uppercase tracking-widest mt-1">Students Enrolled</span>
                   </div>
                   <div className="bg-white rounded-full p-2 group-hover:bg-violet-500 transition-colors">
                      <ChevronRight size={20} className="text-black group-hover:text-white" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[40px] p-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-8 relative">New Classroom</h2>
            
            <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 block">Classroom Name</label>
            <input 
              type="text"
              placeholder="e.g. Grade 10-A Science"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 h-16 text-white text-lg font-bold mb-8 focus:border-violet-500 outline-none transition-all"
            />

            <div className="flex gap-4">
               <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase italic h-16 rounded-2xl transition-all"
               >
                Cancel
               </button>
               <button 
                onClick={createClass}
                className="flex-2 bg-violet-600 hover:bg-violet-700 text-white font-black uppercase italic h-16 rounded-2xl transition-all"
               >
                Create
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
