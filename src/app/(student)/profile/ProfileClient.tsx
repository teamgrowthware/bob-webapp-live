"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User } from "@prisma/client";
import { Trophy, Coins, BrainCircuit, Gamepad2, Gift } from "lucide-react";

export default function ProfileClient({ 
  user, 
  stats 
}: { 
  user: User; 
  stats: { attempts: number; redemptions: number } 
}) {
  const nextTierXP = user.level * 1000;
  const progressPercent = Math.min(100, Math.round((user.xp / nextTierXP) * 100));

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
         <Card className="bg-zinc-900 border-zinc-800 text-center pt-8">
           <CardContent className="space-y-4">
              <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                {user.name?.charAt(0) || "?"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-zinc-400 text-sm">{user.phone}</p>
              </div>
              
              <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Class</p>
                   <p className="text-white font-medium">{user.class}</p>
                 </div>
                 <div>
                   <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">City</p>
                   <p className="text-white font-medium">{user.city}</p>
                 </div>
              </div>
           </CardContent>
         </Card>
      </div>

      <div className="md:col-span-2 space-y-6">
         <Card className="bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border-violet-500/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-600/20 text-violet-400 rounded-lg">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-white">Level {user.level}</h2>
              </div>
              <span className="text-sm font-medium text-violet-300 bg-violet-500/10 px-3 py-1 rounded-full">Prodigy</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">XP Progress</span>
                <span className="text-violet-400 font-medium">{user.xp} / {nextTierXP} XP</span>
              </div>
              <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
           <Card className="bg-zinc-900 border-zinc-800">
             <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Coins className="w-8 h-8 text-amber-500 mb-3" />
                <p className="text-4xl font-black text-white mb-1">{user.coins}</p>
                <p className="text-sm text-zinc-400 font-medium">BOB Coins</p>
             </CardContent>
           </Card>

           <Card className="bg-zinc-900 border-zinc-800">
             <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Gamepad2 className="w-8 h-8 text-cyan-500 mb-3" />
                <p className="text-4xl font-black text-white mb-1">{stats.attempts}</p>
                <p className="text-sm text-zinc-400 font-medium">Quizzes Played</p>
             </CardContent>
           </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
           <CardContent className="p-6 flex items-center gap-6">
             <div className="p-4 bg-emerald-500/10 rounded-2xl">
                <Gift className="w-8 h-8 text-emerald-400" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-white mb-1">{stats.redemptions} Rewards Claimed</h3>
                <p className="text-zinc-400 text-sm">Keep playing Daily Quizzes to collect more rewards from the store.</p>
             </div>
           </CardContent>
        </Card>

      </div>
    </div>
  );
}
