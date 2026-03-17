import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import SavageFeedback from "@/components/SavageFeedback";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft, Zap, Coins } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function QuizResultsPage({ params, searchParams }: { params: { id: string }, searchParams: { score?: string, accuracy?: string } }) {
  const score = parseInt(searchParams.score || "0");
  const accuracy = parseInt(searchParams.accuracy || "0");
  
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id }
  });

  if (!quiz) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: (await getSession())?.userId }
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-violet-600/20 rounded-[32px] flex items-center justify-center mx-auto border border-violet-500/20">
             <Trophy className="text-violet-400 w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">{quiz.title} COMPLETED</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Mission Report Analyzed</p>
        </div>

        <SavageFeedback 
          scorePercent={score} 
          accuracy={accuracy} 
          subject={quiz.subject || "General"} 
          streak={user?.streak || 0} 
          name={user?.name || "Soldier"} 
        />

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] text-center">
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">XP Earned</div>
              <div className="text-3xl font-black text-white flex items-center justify-center gap-2">
                 <Zap className="text-violet-500" size={24} /> +{score * 10}
              </div>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[24px] text-center">
              <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Coins Looted</div>
              <div className="text-3xl font-black text-white flex items-center justify-center gap-2">
                 <Coins className="text-amber-500" size={24} /> +{Math.floor(score / 5)}
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-16 bg-white text-black hover:bg-zinc-200 text-lg font-black rounded-2xl shadow-xl shadow-white/5">
              BACK TO HQ
            </Button>
          </Link>
          <Link href="/leaderboard" className="w-full">
             <Button variant="ghost" className="w-full text-zinc-500 hover:text-white font-black uppercase tracking-widest">
                Check Rankings
             </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
