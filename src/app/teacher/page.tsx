"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, Trophy, BookOpen, TrendingUp, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function TeacherOverview() {
  const [stats, setStats] = useState({
    totalStudents: 142,
    activeQuizzes: 8,
    avgScore: 68,
    completionRate: 85
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">COMMAND OVERVIEW</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Live School Intelligence</p>
        </div>
        <div className="flex gap-4">
           <Link href="/teacher/quizzes">
            <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-black px-6 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-violet-600/20">
              <PlusCircle size={20} />
              NEW QUIZ DROP
            </button>
           </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Enrolled Students", value: stats.totalStudents, icon: <Users className="text-blue-400" />, trend: "+12%" },
          { label: "Active Quizzes", value: stats.activeQuizzes, icon: <BookOpen className="text-violet-400" />, trend: "Steady" },
          { label: "Avg Accuracy", value: `${stats.avgScore}%`, icon: <TrendingUp className="text-emerald-400" />, trend: "+5.2%" },
          { label: "School Rank", value: "#42", icon: <Trophy className="text-amber-400" />, trend: "National" },
        ].map((item, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800 border-b-4 border-b-violet-500/0 hover:border-b-violet-500 transition-all group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase">{item.trend}</span>
              </div>
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{item.label}</p>
              <h3 className="text-3xl font-black text-white mt-1">{item.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Performance */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
           <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-black uppercase tracking-tight">Recent Quiz Drops</h3>
              <Link href="/teacher/quizzes" className="text-violet-400 text-xs font-bold hover:underline">View All</Link>
           </div>
           <div className="divide-y divide-zinc-800">
              {[
                { title: "Quantum Physics Introduction", date: "2 Hours Ago", participants: 45, avg: "72%" },
                { title: "Algebra Mid-Term Prep", date: "Yesterday", participants: 128, avg: "64%" },
                { title: "Geography: World Map", date: "2 Days Ago", participants: 89, avg: "81%" },
              ].map((q, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors cursor-pointer">
                   <div>
                      <p className="font-bold text-white mb-1">{q.title}</p>
                      <p className="text-xs text-zinc-500 font-medium">{q.date} • {q.participants} Students</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-violet-400">{q.avg}</p>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">ACCURACY</p>
                   </div>
                </div>
              ))}
           </div>
        </Card>

        {/* AI Suggestions Card */}
        <Card className="bg-gradient-to-br from-zinc-900 to-violet-950/20 border-violet-500/20 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-3xl -mr-10 -mt-10 group-hover:bg-violet-600/20 transition-all pointer-events-none" />
           <CardContent className="p-10">
              <div className="bg-violet-600/20 p-3 rounded-2xl w-fit mb-6">
                <Sparkles className="text-violet-400 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">AI ANALYTICS<br /><span className="text-violet-500 font-black">INSIGHT</span></h3>
              <p className="text-zinc-400 font-medium mb-8 leading-relaxed">
                We've noticed Classes 8-A are struggling with "Chemical Bonding". Would you like to drop a focused revision battle for this topic?
              </p>
              <Link href="/teacher/quizzes?generate=Chemical+Bonding">
                <Button className="bg-white text-black font-black hover:bg-zinc-200 rounded-xl px-8 h-12">
                  EXECUTE REVISION
                </Button>
              </Link>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
