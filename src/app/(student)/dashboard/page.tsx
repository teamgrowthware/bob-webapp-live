import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Play, Sparkles, BookOpen, User, Flame, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user || !user.name) redirect("/onboarding");

  // Fetch Top Users for Leaderboard
  const topUsers = await prisma.user.findMany({
    orderBy: { xp: 'desc' },
    take: 8,
    select: { id: true, name: true, xp: true, coins: true, level: true }
  });

  // Fetch Recommendations (Daily Study Tips)
  let recommendations = [];
  try {
     const { getRecommendations } = await import("@/lib/recommendations");
     recommendations = await getRecommendations(session.userId);
  } catch(e) {
     console.error("Failed to fetch server-side recommendations");
  }

  // Fetch Assignments (Upcoming Battles)
  const studentEnrollments = await prisma.enrollment.findMany({
    where: { studentId: session.userId },
    include: {
      classroom: {
        include: {
          assignments: {
            where: { dueDate: { gte: new Date() } },
            orderBy: { createdAt: "desc" },
            take: 2,
            include: { quiz: true }
          }
        }
      }
    }
  });
  const activeAssignments = studentEnrollments.flatMap((e: any) => e.classroom.assignments).slice(0, 2);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-20 overflow-x-hidden">
      
      {/* LEFT COLUMN: Main Feed (Col 1-3) */}
      <div className="xl:col-span-3 space-y-6">
         {/* Welcome Header */}
         <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl md:text-4xl font-medium text-white flex items-center gap-2">
               Welcome back, <span className="font-bold text-violet-400">{user.name.split(" ")[0]}!</span> <Flame className="text-orange-500 fill-orange-500 w-6 h-6 animate-pulse" />
            </h1>
            <p className="text-2xl font-semibold text-zinc-300">Your next grand duel awaits:</p>
         </div>

         {/* Hero Card */}
         <div className="relative rounded-[32px] overflow-hidden p-[2px] bg-gradient-to-b from-violet-600/50 to-transparent">
            <div className="absolute inset-0 bg-[#random-bg-url] bg-cover bg-center opacity-20 MixBlendMode-overlay" />
            <div className="bg-[#1f1b2e] rounded-[30px] p-8 md:p-12 relative flex flex-col items-center text-center justify-center min-h-[360px] overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-600/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 blur-[100px] rounded-full" />
                
                {/* Generic Astronaut Icon substitute (or a generic icon) */}
                <div className="w-40 h-40 mb-6 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-3xl rotate-12 group-hover:rotate-0 transition-transform duration-500 flex items-center justify-center shadow-[0_0_60px_rgba(139,92,246,0.5)]">
                    <Sparkles className="w-20 h-20 text-white" />
                </div>
                
                <span className="text-violet-300 font-medium tracking-widest uppercase text-sm mb-3">Ready to challenge your limits?</span>
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-8 max-w-2xl leading-tight">
                   Grade {user.class} Challenge: The Ultimate Duel
                </h2>
                
                <Link href="/battle">
                   <Button size="lg" className="h-16 px-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-green-950 font-black text-xl shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all hover:scale-105 group active:scale-95 italic uppercase tracking-widest border border-green-300/50">
                      START BATTLE NOW
                   </Button>
                </Link>
            </div>
         </div>

         {/* Daily Quiz Banner */}
         <div className="bg-[#1d1b27] border border-cyan-500/20 rounded-[28px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group mt-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-transparent pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-cyan-500/20 transition-all duration-700" />
            
            <div className="flex-1 z-10 text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                 <Target className="w-3 h-3" /> Live Mission
               </div>
               <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">Daily Savage Quiz</h2>
               <p className="text-zinc-400 text-sm font-medium">Destroy the competition. Win BOB Coins. 10 Minutes of pure focus.</p>
            </div>
            
            <Link href="/quiz" className="z-10 w-full md:w-auto">
               <Button className="w-full md:w-auto h-14 px-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-black italic uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 transition-all">
                  <Play className="mr-2 w-5 h-5 fill-current" /> Ignite
               </Button>
            </Link>
         </div>

         {/* Two Column Grid layout below Hero */}
         <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Upcoming Battles */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Upcoming Battles</h3>
               <div className="grid gap-4">
                  {activeAssignments.length > 0 ? activeAssignments.map((assignment: any) => (
                    <Link href={`/quiz/${assignment.quizId}`} key={assignment.id}>
                        <div className="bg-[#1d1b27] border border-white/5 rounded-2xl p-5 hover:bg-white/5 transition-colors group flex items-center gap-4 cursor-pointer">
                            <div className="w-14 h-14 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                               <h4 className="font-bold text-white leading-tight">{assignment.quiz.title}</h4>
                               <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-semibold">{assignment.quiz.subject}</p>
                            </div>
                        </div>
                    </Link>
                  )) : (
                    <div className="bg-[#1d1b27] border border-white/5 rounded-2xl p-6 text-center text-zinc-500 text-sm font-medium">
                        No upcoming assignments! Relax.
                    </div>
                  )}
               </div>
            </div>

            {/* Daily Study Tips */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Daily Study Tips</h3>
               <p className="text-xs text-zinc-500 -mt-3 mb-2">Curated for the chosen subject:</p>
               <div className="grid gap-4">
                  {recommendations.length > 0 ? recommendations.slice(0, 2).map((rec: any, i: number) => (
                      <div key={i} className="bg-[#1d1b27] border border-white/5 rounded-2xl p-5 hover:bg-white/5 transition-colors group flex items-start gap-4">
                          <div className="w-12 h-12 mt-1 rounded-xl bg-fuchsia-600/20 text-fuchsia-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                             <h4 className="font-bold text-white leading-tight line-clamp-1">{rec.chapterTitle}</h4>
                             <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{rec.content}</p>
                          </div>
                      </div>
                  )) : (
                      <div className="bg-[#1d1b27] border border-white/5 rounded-2xl p-6 text-center text-zinc-500 text-sm font-medium">
                        Solve more quizzes to get tips!
                      </div>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT COLUMN: Leaderboard */}
      <div className="xl:col-span-1">
         <div className="bg-[#1d1b27] border border-[#b29f4b]/20 rounded-3xl p-6 sticky top-28 h-[calc(100vh-8rem)] flex flex-col shadow-[0_0_50px_rgba(202,138,4,0.05)]">
            <h3 className="text-[#eab308] font-bold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
               Global Top Performers
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
               {topUsers.map((u, index) => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                     <span className={`w-6 text-center font-bold text-lg ${index < 3 ? 'text-amber-400' : 'text-zinc-500'}`}>
                        {index + 1}
                     </span>
                     
                     <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                        <User className="w-5 h-5 text-zinc-500" />
                     </div>

                     <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-bold truncate tracking-tight">{u.name}</p>
                        <p className="text-[10px] text-violet-400 uppercase tracking-widest font-bold truncate">Lvl {u.level} Mastermind</p>
                     </div>

                     <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                           <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center" />
                           <span className="text-xs font-bold text-blue-400">{u.xp}</span>
                        </div>
                        <div className="flex items-center gap-1">
                           <div className="w-3 h-3 rounded-full bg-amber-500 flex items-center justify-center" />
                           <span className="text-xs font-bold text-amber-500">{u.coins}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}
