import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Coins, BrainCircuit, ShieldAlert, Target, Play, Sparkles, BookOpen, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Timetable from "@/components/Timetable";
import StreakFire from "@/components/StreakFire";
import JoinClassForm from "@/components/JoinClassForm";

export default async function DashboardPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user || !user.name) redirect("/onboarding");

  // 1. REAL RANK CALCULATION
  const rank = await prisma.user.count({
    where: {
      xp: { gt: user.xp }
    }
  }) + 1;

  // 2. FETCH RECOMMENDATIONS
  let recommendations = [];
  try {
     const recResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/recommendations`, {
        headers: { Cookie: (await import('next/headers')).cookies().toString() }
     });
     if (recResponse.ok) recommendations = await recResponse.json();
  } catch(e) {
     console.error("Failed to fetch server-side recommendations");
  }

  const nextTierXP = user.level * 1000;
  const progressPercent = Math.min(100, Math.round((user.xp / nextTierXP) * 100));

  // 3. FETCH STUDENT ENROLLMENTS & ASSIGNMENTS
  const studentEnrollments = await prisma.enrollment.findMany({
    where: { studentId: session.userId },
    include: {
      classroom: {
        include: {
          assignments: {
            orderBy: { createdAt: "desc" },
            include: { quiz: true }
          }
        }
      }
    }
  });

  const activeAssignments = studentEnrollments.flatMap((e: any) => e.classroom.assignments);

  // 4. FETCH ACTIVE BANNERS
  const banners = await prisma.adBanner.findMany({
    where: { isActive: true, location: "DASHBOARD" },
    take: 1
  });

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {searchParams.error === 'already_attempted' && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-center gap-3 font-medium">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <p>You've already conquered today's Daily Quiz! Wait for tomorrow to earn more Coins.</p>
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
                Level Up, {user.name.split(" ")[0]}!
              </h1>
              {/* Desktop Mode Badge */}
              <div id="desktop-badge" className="hidden border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter italic">
                Desktop Kiosk
              </div>
              <script dangerouslySetInnerHTML={{ __html: `
                if (window.electron) { document.getElementById('desktop-badge').classList.remove('hidden'); }
              `}} />
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Class {user.class} • {user.school} • {user.city}</p>
          </div>
          <StreakFire streak={user.streak} />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex gap-6 px-8 shadow-2xl">
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Rank</p>
            <p className="text-2xl text-white font-black italic">#{rank}</p>
          </div>
          <div className="w-px bg-zinc-800" />
          <div className="text-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Status</p>
            <p className="text-2xl text-violet-400 font-black italic">{user.level > 5 ? 'ELITE' : 'NEWBIE'}</p>
          </div>
        </div>
      </div>

      {/* Recommended Learning (RAG) */}
      {recommendations.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-500 w-5 h-5" />
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">AI Learning path</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((rec: any, i: number) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden group hover:border-violet-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-violet-600/20 text-violet-400 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-violet-500/20">{rec.subject || 'Biology'}</span>
                    <BookOpen size={16} className="text-zinc-700" />
                  </div>
                  <h3 className="text-white font-black text-lg leading-tight mb-4 lowercase first-letter:uppercase italic">"{rec.chapterTitle}"</h3>
                  <p className="text-zinc-500 text-xs font-medium line-clamp-3 mb-6 leading-relaxed">
                    {rec.content}
                  </p>
                  <Button variant="outline" className="w-full bg-zinc-950 border-zinc-800 text-white rounded-2xl font-black italic uppercase text-xs h-12 flex items-center justify-between group-hover:bg-white group-hover:text-black transition-all">
                    Start Learning <Play size={14} fill="currentColor" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Monetization: Ad Banner */}
      {banners.length > 0 && (
        <Link href={banners[0].linkUrl} target="_blank">
          <div className="relative h-32 md:h-48 rounded-[32px] overflow-hidden group cursor-pointer border border-zinc-800 shadow-2xl transition-transform hover:scale-[1.01]">
            <img src={banners[0].imageUrl} alt={banners[0].title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12">
               <span className="text-amber-500 font-black text-[8px] uppercase tracking-[0.3em] mb-2 font-mono">Sponsored</span>
               <h2 className="text-white text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">{banners[0].title}</h2>
               <div className="flex items-center gap-2 mt-4 text-white/60 group-hover:text-white transition-colors">
                 <span className="text-[10px] font-black uppercase tracking-widest">Explore Now</span>
                 <Play size={10} className="fill-current" />
               </div>
            </div>
          </div>
        </Link>
      )}

      {/* Gamified Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border-violet-500/20 rounded-[32px]">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-600/20 text-violet-400 rounded-xl">
                  <BrainCircuit size={24} />
                </div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Level {user.level}</h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-zinc-500">XP Progress</span>
                <span className="text-violet-400">{user.xp} / {nextTierXP} XP</span>
              </div>
              <div className="h-4 w-full bg-zinc-950 rounded-full overflow-hidden p-1 border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px]">
          <CardContent className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                  <Coins size={24} />
                </div>
                <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Your Bag</h2>
              </div>
            </div>

            <div className="flex items-end gap-3">
              <span className="text-6xl font-black text-white italic tracking-tighter leading-none">{user.coins}</span>
              <span className="text-amber-500 font-black uppercase tracking-tighter text-sm mb-1 italic">BOB Coins</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classroom Section */}
      <section className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
               <GraduationCap className="text-violet-500 w-5 h-5" />
               <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Squad Missions</h2>
            </div>
            {activeAssignments.length === 0 ? (
               <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-10 text-center border-dashed">
                  <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No active missions from teachers.</p>
               </div>
            ) : (
               <div className="grid md:grid-cols-2 gap-4">
                  {activeAssignments.map((assignment: any) => (
                     <Link key={assignment.id} href={`/quiz/${assignment.quizId}`}>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:border-violet-500/50 transition-all border-l-4 border-l-violet-600">
                           <h4 className="text-white font-black uppercase italic group-hover:text-violet-400 transition-colors">{assignment.quiz.title}</h4>
                           <div className="flex justify-between items-center mt-3">
                              <span className="text-zinc-500 text-[10px] font-bold uppercase">{assignment.quiz.subject}</span>
                              <div className="bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                                 <span className="text-zinc-400 text-[8px] font-black uppercase">Due {new Date(assignment.dueDate || Date.now()).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                     </Link>
                  ))}
               </div>
            )}
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-3">
               <Users className="text-cyan-500 w-5 h-5" />
               <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">My Squads</h2>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6">
               {studentEnrollments.length === 0 ? (
                  <div className="text-center py-4">
                     <p className="text-zinc-600 text-xs font-bold leading-relaxed mb-6">You're not in any squads yet.<br/>Join your school class!</p>
                     <JoinClassForm />
                  </div>
               ) : (
                  <div className="space-y-4">
                     {studentEnrollments.map((e: any) => (
                        <div key={e.id} className="flex items-center justify-between border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                           <div>
                              <p className="text-white font-black text-sm uppercase italic">{e.classroom.name}</p>
                              <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">Code: {e.classroom.code}</p>
                           </div>
                           <div className="bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                              <span className="text-zinc-400 text-[8px] font-black uppercase">Active</span>
                           </div>
                        </div>
                     ))}
                     <div className="pt-4 border-t border-zinc-800 border-dashed">
                        <JoinClassForm />
                     </div>
                  </div>
               )}
            </div>
         </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-12">
          <Timetable />

          <div className="relative overflow-hidden rounded-[40px] p-8 md:p-12 border border-zinc-800 bg-zinc-900 shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  <Target className="w-3 h-3" />
                  Live Now
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">Daily Savage Quiz</h2>
                <p className="text-zinc-500 font-bold max-w-sm mx-auto md:mx-0">
                  Secure the top spot. 10 questions. 0 mercy.
                </p>
              </div>

              <Link href="/quiz">
                <Button size="lg" className="h-20 px-10 rounded-[28px] bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-black text-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] transition-all hover:scale-105 group active:scale-95 italic uppercase tracking-tighter">
                  <Play className="mr-3 w-8 h-8 group-hover:fill-cyan-950" />
                  Burn quiz
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-[40px] p-8 border border-zinc-800 bg-zinc-950 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/10 to-fuchsia-600/5 pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest mb-8">
                <ShieldAlert className="w-3 h-3 animate-pulse" />
                1v1 match
              </div>
              <h2 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">Global Arena</h2>
              <p className="text-zinc-500 font-bold text-sm mb-10 leading-relaxed uppercase tracking-tighter">
                Challenge anyone. Fastest takes all.
              </p>

              <Link href="/battle">
                <Button size="lg" className="w-full h-16 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xl italic uppercase tracking-tighter shadow-[0_0_50px_rgba(225,29,72,0.2)]">
                  Enter War
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
