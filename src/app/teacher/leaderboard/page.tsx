"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Crown, Medal, TrendingUp, Users, Target } from "lucide-react";

export default function SchoolLeaderboardPage() {
  const [topStudents, setTopStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/teacher/students");
      if (res.ok) {
        const data = await res.json();
        setTopStudents(data.slice(0, 10)); // Get top 10
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return <div className="p-24 text-center text-zinc-500 font-black uppercase tracking-widest text-xl">Loading Leaderboard...</div>;
  }
  
  if (topStudents.length === 0) {
     return <div className="p-24 text-center text-zinc-500 font-black uppercase tracking-widest text-xl">No players in your academy yet.</div>;
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-white uppercase leading-none">SCHOOL HALL OF FAME</h1>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">Internal rankings for Brainiacs Academy</p>
      </header>

      {/* Top 3 Visual Podium */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-center pt-8 pb-12">
         {/* Rank 2 */}
         <div className="w-full md:w-64 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 text-center relative order-2 md:order-1 active:scale-95 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 p-3 rounded-2xl border border-zinc-700">
               <Medal color="#d4d4d8" size={32} />
            </div>
            <div className="w-20 h-20 bg-gradient-to-tr from-zinc-700 to-zinc-500 rounded-full mx-auto mb-4 border-4 border-zinc-800 shadow-xl" />
            <h3 className="font-black text-white text-xl uppercase tracking-tight">{topStudents[1]?.name || "N/A"}</h3>
            <p className="text-zinc-500 text-xs font-black uppercase mb-4">{topStudents[1]?.class || "--"}</p>
            <div className="text-2xl font-black text-white tracking-widest">{topStudents[1]?.xp?.toLocaleString() || 0}<span className="text-xs text-zinc-500 ml-1">XP</span></div>
         </div>

         {/* Rank 1 */}
         <div className="w-full md:w-72 bg-gradient-to-b from-violet-600/20 to-zinc-900 border border-violet-500/30 rounded-[40px] p-10 text-center relative order-1 md:order-2 z-10 scale-110 shadow-2xl shadow-violet-600/10">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-violet-600 p-4 rounded-3xl shadow-xl shadow-violet-600/40">
               <Crown color="#fff" size={40} />
            </div>
            <div className="w-28 h-28 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-full mx-auto mb-6 border-4 border-zinc-900 shadow-2xl" />
            <h3 className="font-black text-white text-2xl uppercase tracking-tight">{topStudents[0]?.name || "N/A"}</h3>
            <p className="text-violet-400 text-sm font-black uppercase mb-6 tracking-widest font-sans">{topStudents[0]?.class || "--"}</p>
            <div className="text-4xl font-black text-white tracking-tighter">{topStudents[0]?.xp?.toLocaleString() || 0}<span className="text-sm text-violet-500 ml-1">XP</span></div>
         </div>

         {/* Rank 3 */}
         <div className="w-full md:w-64 bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 text-center relative order-3 md:order-3 active:scale-95 transition-all">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 p-3 rounded-2xl border border-zinc-700">
               <Medal color="#7c2d12" size={32} />
            </div>
            <div className="w-20 h-20 bg-gradient-to-tr from-orange-800 to-orange-600 rounded-full mx-auto mb-4 border-4 border-zinc-800 shadow-xl" />
            <h3 className="font-black text-white text-xl uppercase tracking-tight">{topStudents[2]?.name || "N/A"}</h3>
            <p className="text-zinc-500 text-xs font-black uppercase mb-4">{topStudents[2]?.class || "--"}</p>
            <div className="text-2xl font-black text-white tracking-widest">{topStudents[2]?.xp?.toLocaleString() || 0}<span className="text-xs text-zinc-500 ml-1">XP</span></div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Detailed Rankings */}
         <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl">
               <div className="p-8 border-b border-zinc-800">
                  <h3 className="font-black text-white uppercase tracking-widest flex items-center gap-2">
                     <Target className="text-violet-500" /> Season 1 Rankings
                  </h3>
               </div>
               <Table>
                  <TableHeader className="bg-zinc-950">
                     <TableRow className="border-zinc-800">
                        <TableHead className="font-black text-zinc-500 px-8 uppercase tracking-widest text-xs">Rank</TableHead>
                        <TableHead className="font-black text-zinc-500 uppercase tracking-widest text-xs">Player</TableHead>
                        <TableHead className="font-black text-zinc-500 uppercase tracking-widest text-xs">Win Rate</TableHead>
                        <TableHead className="font-black text-zinc-500 uppercase tracking-widest text-xs text-right px-8">Score</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {topStudents.map((s) => (
                        <TableRow key={s.rank} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                           <TableCell className="px-8 py-6 font-black text-xl italic text-zinc-600">#{s.rank}</TableCell>
                           <TableCell>
                              <div className="flex flex-col">
                                 <span className="font-black text-white text-base uppercase leading-none mb-1">{s.name}</span>
                                 <span className="text-[10px] font-black text-zinc-500 tracking-widest">{s.class}</span>
                              </div>
                           </TableCell>
                           <TableCell className="font-black text-emerald-400">{s.accuracy || "0%"}</TableCell>
                           <TableCell className="text-right px-8 font-black text-white text-lg tracking-tight">
                              {s.xp?.toLocaleString() || 0} <span className="text-[10px] text-zinc-600 ml-0.5">XP</span>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </Card>
         </div>

         {/* Side Insights */}
         <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8">
               <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-violet-500" />
                  <h4 className="font-black text-white uppercase tracking-widest">Growth Leaders</h4>
               </div>
               <div className="space-y-6">
                  {[
                     { name: "Varun J.", rise: "+450 XP", pct: "+12%" },
                     { name: "Sanya M.", rise: "+320 XP", pct: "+8%" },
                     { name: "Arjun K.", rise: "+280 XP", pct: "+5%" },
                  ].map((leader, i) => (
                     <div key={i} className="flex justify-between items-center">
                        <span className="font-bold text-zinc-400">{leader.name}</span>
                        <div className="text-right">
                           <p className="text-emerald-400 font-black text-sm">{leader.rise}</p>
                           <p className="text-[10px] text-zinc-600 font-bold uppercase">{leader.pct} this week</p>
                        </div>
                     </div>
                  ))}
               </div>
            </Card>

            <Card className="bg-violet-600 rounded-3xl p-8 shadow-2xl shadow-violet-600/20">
               <Users className="text-white/50 mb-6 w-12 h-12" />
               <h4 className="text-white font-black text-2xl uppercase tracking-tight mb-4 leading-none">Class 10-A is Dominating!</h4>
               <p className="text-white/80 font-medium mb-6">They have held the top spot for 3 consecutive weeks. Other classes need to gear up.</p>
               <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[75%]" />
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
