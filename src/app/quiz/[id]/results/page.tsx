import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import SavageFeedback from "@/components/SavageFeedback";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft, Zap, Coins, Medal, Star } from "lucide-react";
import Link from "next/link";
import Confetti from "@/components/Confetti";
import GlowCard from "@/components/GlowCard";

const prisma = new PrismaClient();

export default async function QuizResultsPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ score?: string, accuracy?: string }> }) {
  const { id: quizId } = await params;
  const { score: scoreParam, accuracy: accuracyParam } = await searchParams;
  const score = parseInt(scoreParam || "0");
  const accuracy = parseInt(accuracyParam || "0");

  let quiz: any = null;
  let user: any = null;

  try {
    if (quizId === "daily-mock") {
      quiz = {
        id: "daily-mock",
        title: "Savage Daily Drop (Demo Mode)",
        subject: "General Knowledge"
      };
    } else {
      quiz = await prisma.quiz.findUnique({
        where: { id: quizId }
      });
    }

    const session = await getSession();
    if (session?.userId) {
      user = await prisma.user.findUnique({
        where: { id: session.userId }
      });
    }
  } catch (error) {
    console.error("Quiz Results DB Error:", error);
    // Fallback if DB is down
    if (!quiz && quizId === "daily-mock") {
      quiz = {
        id: "daily-mock",
        title: "Savage Daily Drop (Demo Mode)",
        subject: "General Knowledge"
      };
    }
  }

  if (!quiz) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Celebration Confetti */}
      {accuracy >= 80 && <Confetti />}

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="w-full max-w-3xl space-y-10 relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        
        <div className="text-center space-y-6">
          <div className="relative w-28 h-28 mx-auto">
              <div className="absolute inset-0 bg-violet-600 blur-2xl opacity-20 animate-pulse" />
              <div className="relative w-full h-full bg-zinc-900 rounded-[38px] flex items-center justify-center border border-white/10 shadow-2xl">
                 <Trophy className="text-violet-400 w-12 h-12" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 p-2 rounded-xl shadow-lg rotate-12">
                 <Medal size={20} className="text-black" />
              </div>
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tight uppercase leading-none">{quiz.title}</h1>
            <p className="text-amber-500 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Mission Status: Decimated</p>
          </div>
        </div>

        <SavageFeedback 
          scorePercent={accuracy} 
          accuracy={accuracy} 
          subject={quiz.subject || "General"} 
          streak={user?.streak || 0} 
          name={user?.name || "Soldier"} 
        />

        <div className="grid grid-cols-2 gap-6">
           <GlowCard glowColor="violet" animate={false}>
              <div className="p-8 text-center relative group">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={40} className="text-violet-400" />
                </div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Battle Experience</div>
                <div className="text-5xl font-black text-white flex items-center justify-center gap-3 italic">
                   +{score} <span className="text-violet-500 text-xl">XP</span>
                </div>
              </div>
           </GlowCard>
           <GlowCard glowColor="amber" animate={false}>
              <div className="p-8 text-center relative group">
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Coins size={40} className="text-amber-400" />
                </div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Vault Riches</div>
                <div className="text-5xl font-black text-white flex items-center justify-center gap-3 italic">
                   +{Math.floor(accuracy / 2)} <span className="text-amber-500 text-xl">BC</span>
                </div>
              </div>
           </GlowCard>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full h-20 bg-white text-black hover:bg-zinc-200 text-xl font-black rounded-[24px] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase italic tracking-tight">
              Return to HQ
            </Button>
          </Link>
          <Link href="/leaderboard" className="flex-1">
             <Button variant="outline" className="w-full h-20 border-white/10 bg-white/5 text-white hover:bg-white/10 text-xl font-black rounded-[24px] uppercase italic tracking-tight">
                Hall of Fame
             </Button>
          </Link>
        </div>

        <div className="pt-6 text-center">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Star size={10} className="fill-current" />
                Rank up to unlock elite missions
                <Star size={10} className="fill-current" />
            </p>
        </div>
      </div>
    </div>
  );
}
