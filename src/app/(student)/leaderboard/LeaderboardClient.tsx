"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Medal, Crown, MapPin, Globe, Star } from "lucide-react";

export default function LeaderboardClient({ initialUsers, userCity }: { initialUsers: any[], userCity?: string }) {
  const [filter, setFilter] = useState("GLOBAL"); // GLOBAL | CITY

  const filteredUsers = [...initialUsers]
    .filter(u => filter === "CITY" ? u.city === userCity : true)
    .sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-fuchsia-500/20 text-fuchsia-500 rounded-2xl">
            <Medal className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase italic tracking-tight">Arena Rankings</h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">The smartest minds dominating the arena.</p>
          </div>
        </div>

        <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
          {[
            { id: "GLOBAL", icon: <Globe size={14} />, label: "Global" },
            { id: "CITY",   icon: <MapPin size={14} />, label: userCity || "City" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                filter === t.id ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user, idx) => {
          const isTop3 = idx < 3;

          return (
            <Card
              key={user.id}
              className={`bg-zinc-900 border-zinc-800 overflow-hidden group hover:bg-zinc-800/50 transition-all ${
                user.isFeatured
                  ? "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                  : isTop3
                  ? "border-l-4 border-l-fuchsia-500"
                  : "hover:border-zinc-700"
              }`}
            >
              <CardContent className="p-5 flex items-center gap-6">
                {/* Rank badge */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl transition-transform group-hover:scale-110 ${
                  idx === 0 ? "bg-gradient-to-br from-amber-400 to-orange-600 text-white" :
                  idx === 1 ? "bg-zinc-300 text-zinc-950" :
                  idx === 2 ? "bg-orange-800 text-orange-200" : "bg-zinc-950 text-zinc-600 border border-zinc-800"
                }`}>
                  {idx === 0 ? <Crown className="w-7 h-7" /> : <span className="italic">#{idx + 1}</span>}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-black text-white text-xl uppercase tracking-tight truncate">{user.name}</h3>
                    {user.isFeatured && (
                      <span className="flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                        <Star size={9} className="fill-amber-400" /> Featured
                      </span>
                    )}
                    <span className="text-[10px] font-black px-2 py-1 rounded-md bg-violet-600/10 text-violet-400 border border-violet-500/20 uppercase">
                      Level {user.level}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-zinc-500 flex items-center gap-2 uppercase tracking-widest">
                    <MapPin size={12} className="text-zinc-700" />
                    {user.school || "Freelance Brain"} • {user.city}
                  </p>
                </div>

                {/* XP */}
                <div className="text-right shrink-0">
                  <p className="font-black text-2xl text-white italic">{user.xp.toLocaleString()}</p>
                  <p className="text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.3em]">Total XP</p>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center p-20 text-zinc-600 border-2 border-zinc-800 border-dashed rounded-[40px]">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-widest text-sm">No warriors found in this sector.</p>
          </div>
        )}
      </div>

      <div className="pb-10" />
    </div>
  );
}
