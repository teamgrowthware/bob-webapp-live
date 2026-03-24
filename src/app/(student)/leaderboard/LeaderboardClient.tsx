"use client";

import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Medal, Crown, MapPin, Globe, Star, Zap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlowCard from "@/components/GlowCard";

export default function LeaderboardClient({ initialUsers, userCity }: { initialUsers: any[], userCity?: string }) {
  const [filter, setFilter] = useState("GLOBAL"); // GLOBAL | CITY

  const filteredUsers = [...initialUsers]
    .filter(u => filter === "CITY" ? u.city === userCity : true)
    .sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 bg-zinc-950">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full animate-float" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-fuchsia-600 shadow-[0_0_30px_rgba(217,70,239,0.3)] text-white rounded-[24px]">
            <Crown className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Arena Rankings</h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 flex items-center gap-2">
                <TrendingUp size={12} className="text-fuchsia-500" />
                The elite minds dominating the sector.
            </p>
          </div>
        </div>

        <div className="flex bg-zinc-950 p-1.5 rounded-[20px] border border-white/5 shadow-inner">
          {[
            { id: "GLOBAL", icon: <Globe size={14} />, label: "Global Arena" },
            { id: "CITY",   icon: <MapPin size={14} />, label: userCity || "Local Sector" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em] ${
                filter === t.id ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]" : "text-zinc-500 hover:text-white"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user, idx) => {
            const isTop3 = idx < 3;
            const glowColor = idx === 0 ? "amber" : idx === 1 ? "cyan" : idx === 2 ? "rose" : "violet";

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <GlowCard 
                  glowColor={glowColor}
                  animate={false}
                  className={`border-0 ${user.isFeatured ? 'ring-2 ring-amber-500/30' : ''}`}
                >
                  <CardContent className="p-2 sm:p-4 flex items-center gap-4 sm:gap-8">
                    {/* Rank Indicator */}
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[28px] flex items-center justify-center font-black text-2xl sm:text-3xl shadow-2xl transition-transform group-hover:scale-110 shrink-0 ${
                      idx === 0 ? "bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-amber-500/20" :
                      idx === 1 ? "bg-gradient-to-br from-zinc-200 to-zinc-400 text-zinc-950 shadow-zinc-400/20" :
                      idx === 2 ? "bg-gradient-to-br from-orange-600 to-rose-800 text-orange-100 shadow-rose-900/20" : 
                      "bg-zinc-950 text-zinc-600 border border-white/5"
                    }`}>
                      {idx === 0 ? <Crown size={32} /> : <span className="italic">#{idx + 1}</span>}
                    </div>

                    {/* Warrior Info */}
                    <div className="flex-1 min-w-0 py-2">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-black text-white text-lg sm:text-2xl uppercase tracking-tighter truncate italic">{user.name}</h3>
                        {user.isFeatured && (
                          <span className="flex items-center gap-1.5 text-[8px] font-black px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                            <Star size={10} className="fill-amber-500" /> ELITE
                          </span>
                        )}
                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                             idx === 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-violet-600/10 border-violet-500/20 text-violet-400"
                        }`}>
                          Rank {user.level}
                        </span>
                      </div>
                      <p className="text-[10px] font-black text-zinc-500 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <MapPin size={10} className="text-zinc-700" />
                        {user.school || "Autonomous Brain"} <span className="text-zinc-800">•</span> {user.city}
                      </p>
                    </div>

                    {/* Combat XP */}
                    <div className="text-right shrink-0 pr-4 sm:pr-8">
                       <div className="flex items-center justify-end gap-2 mb-1">
                          <span className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter tabular-nums">{user.xp.toLocaleString()}</span>
                          <Zap size={16} className="text-fuchsia-500" />
                       </div>
                       <p className="text-[9px] font-black text-fuchsia-500 uppercase tracking-[0.4em] leading-none">Power XP</p>
                    </div>
                  </CardContent>
                </GlowCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-32 text-zinc-600 border-2 border-white/5 border-dashed rounded-[50px] bg-zinc-950/20"
          >
            <Globe className="w-16 h-16 mx-auto mb-6 opacity-10 animate-pulse" />
            <p className="font-black uppercase tracking-[0.3em] text-[10px]">No warriors detected in this sector.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
