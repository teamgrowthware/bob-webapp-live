"use client";

import { Flame } from "lucide-react";

export default function StreakFire({ streak }: { streak: number }) {
  if (streak === 0) return null;

  return (
    <div className="relative group cursor-help">
      <div className="absolute inset-0 bg-orange-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
      <div className="relative flex items-center gap-2 bg-zinc-900 border border-orange-500/30 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.15)]">
        <div className="relative">
          <Flame className="w-6 h-6 text-orange-500 animate-bounce fill-orange-500/20" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest leading-none">Streak</span>
          <span className="text-xl font-black text-white italic leading-tight">{streak}d</span>
        </div>
      </div>
      
      {/* Tooltip effect */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-orange-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
        <p className="text-[10px] font-black text-white uppercase tracking-widest">
          {streak > 5 ? "You're on fire! 🔥" : "Keep it up!"}
        </p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-orange-600" />
      </div>
    </div>
  );
}
