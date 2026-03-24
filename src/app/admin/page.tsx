"use client";

import { useEffect, useState } from "react";
import { Users, BookOpen, Clock, Activity, Zap, TrendingUp } from "lucide-react";

interface Stats {
  students: number;
  schools: number;
  waitlist: number;
  quizzes: number;
  todayAttempts: number;
  dau: number;
  participationRate: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div className="text-zinc-500 font-bold">Initializing Command Center...</div>;

  const cards = [
    { name: "Total Students", value: stats.students, icon: Users, color: "text-violet-500" },
    { name: "Daily Active Users", value: stats.dau, icon: Activity, color: "text-emerald-500" },
    { name: "Participation Rate", value: `${stats.participationRate}%`, icon: Zap, color: "text-amber-500" },
    { name: "Active Quizzes", value: stats.quizzes, icon: BookOpen, color: "text-fuchsia-500" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter">Command Center</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Real-time ecosystem overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className="bg-zinc-900/50 border border-zinc-900 p-6 rounded-3xl group hover:border-violet-500/50 transition-all duration-500">
               <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-zinc-950 border border-zinc-800 ${card.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="bg-green-500/10 text-green-500 px-2 py-1 rounded-lg text-[10px] font-black italic">+12%</div>
               </div>
               <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{card.name}</h3>
               <p className="text-4xl font-black mt-1 italic tracking-tighter">{card.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-zinc-900/30 border border-zinc-900 rounded-[32px] p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-xl font-black uppercase italic tracking-tighter">Participation Trend</h2>
               <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-violet-500 mt-1"></div>
                  <span className="text-xs font-bold text-zinc-500 uppercase">Daily Attempts: {stats.todayAttempts}</span>
               </div>
            </div>
            {/* Visual Placeholder for Graph */}
            <div className="w-full h-64 bg-zinc-950 rounded-2xl border border-zinc-900 border-dashed flex items-center justify-center">
               <TrendingUp size={48} className="text-zinc-800" />
            </div>
         </div>

         <div className="bg-zinc-900/30 border border-zinc-900 rounded-[32px] p-8">
            <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8">System Health</h2>
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-400">Next Server</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-black text-white uppercase italic">Active</span>
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-400">Postgres DB</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-black text-white uppercase italic">Healthy</span>
                  </div>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-400">WebSocket Node</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-black text-white uppercase italic">Online</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
