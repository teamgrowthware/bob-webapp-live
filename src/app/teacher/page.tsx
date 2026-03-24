import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Trophy, Zap, Clock } from "lucide-react";
import Link from "next/link";
import GlowCard from "@/components/GlowCard";

export default async function TeacherOverviewPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const teacher = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      taughtClasses: {
        include: {
          students: true,
          assignments: {
            include: { quiz: true }
          }
        }
      }
    }
  });

  if (!teacher || teacher.role !== "TEACHER") {
    return <div className="p-10 text-white font-black uppercase tracking-tighter">Access Denied: Teachers Only Arena</div>;
  }

  const totalStudents = teacher.taughtClasses.reduce((acc, c) => acc + c.students.length, 0);
  const totalAssignments = teacher.taughtClasses.reduce((acc, c) => acc + c.assignments.length, 0);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
            Squad Commander<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">{teacher.name}</span>
          </h1>
          <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] mt-4">Commanding {teacher.taughtClasses.length} Classrooms</p>
        </div>
        
        <Link href="/teacher/quizzes/forge">
          <button className="h-16 px-10 rounded-2xl bg-white text-black font-black uppercase italic text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
            Deploy New Mission
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Recruits", value: totalStudents, icon: <Users />, color: "violet" },
          { label: "Active Missions", value: totalAssignments, icon: <Zap />, color: "amber" },
          { label: "Avg. Accuracy", value: "78%", icon: <Trophy />, color: "emerald" },
          { label: "Battle Hours", value: "124h", icon: <Clock />, color: "cyan" }
        ].map((stat, i) => (
          <GlowCard key={i} glowColor={stat.color as any}>
            <CardContent className="p-8 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-zinc-950 border border-white/5`}>
                {stat.icon}
              </div>
              <p className="text-4xl font-black text-white italic mb-1">{stat.value}</p>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{stat.label}</p>
            </CardContent>
          </GlowCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Classrooms List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
             <BookOpen className="text-violet-400 w-5 h-5" />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Your Squads</h2>
          </div>
          
          <div className="grid gap-6">
            {teacher.taughtClasses.length === 0 ? (
              <div className="glass p-16 rounded-[40px] border border-dashed border-white/10 text-center">
                <p className="text-zinc-500 font-black uppercase italic">No squads deployed yet.</p>
                <Link href="/teacher/dashboard" className="mt-4 inline-block text-violet-400 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Setup Classrooms →</Link>
              </div>
            ) : (
              teacher.taughtClasses.map((classroom) => (
                <GlowCard key={classroom.id} glowColor="violet">
                  <div className="p-8 flex items-center justify-between group">
                    <div>
                      <h3 className="text-2xl font-black text-white uppercase italic group-hover:text-violet-400 transition-colors">{classroom.name}</h3>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">{classroom.students.length} Students • Code: {classroom.code}</p>
                    </div>
                    <div className="flex gap-4">
                      <Link href={`/teacher/students?classId=${classroom.id}`}>
                        <button className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/30 transition-all">
                          <Users size={20} className="text-zinc-400" />
                        </button>
                      </Link>
                      <Link href={`/teacher/quizzes?classId=${classroom.id}`}>
                        <button className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all">
                          <Zap size={20} className="text-zinc-400" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </GlowCard>
              ))
            )}
          </div>
        </div>

        {/* Top Performers Sidebar */}
        <div className="space-y-6">
           <div className="flex items-center gap-3">
             <Trophy className="text-amber-500 w-5 h-5" />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Top Warriors</h2>
           </div>
           <GlowCard glowColor="amber">
             <div className="p-8 space-y-6">
                <p className="text-zinc-500 font-black text-[10px] uppercase tracking-widest text-center border-b border-white/5 pb-4">National Rankings Preview</p>
                {[
                  { name: "Aryan S.", level: 42, xp: "12,450", rank: 1 },
                  { name: "Priya V.", level: 38, xp: "10,200", rank: 2 },
                  { name: "Rajat K.", level: 35, xp: "9,800", rank: 3 }
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-700 font-black italic">#0{p.rank}</span>
                      <div>
                        <p className="text-white font-black italic text-sm uppercase">{p.name}</p>
                        <p className="text-zinc-600 text-[8px] font-black uppercase">Level {p.level}</p>
                      </div>
                    </div>
                    <span className="text-amber-500 font-black text-[10px]">{p.xp} XP</span>
                  </div>
                ))}
                <Link href="/leaderboard" className="block pt-4 text-center">
                   <span className="text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors cursor-pointer tracking-widest">Full Intel Report →</span>
                </Link>
             </div>
           </GlowCard>
        </div>
      </div>
    </div>
  );
}
