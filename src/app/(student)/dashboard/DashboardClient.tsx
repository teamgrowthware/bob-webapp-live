"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Target, Play } from "lucide-react";

export function DashboardAlert({ error }: { error?: string }) {
  if (error !== 'already_attempted') return null;
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl flex items-center gap-3 font-medium"
    >
      <ShieldAlert className="w-5 h-5 flex-shrink-0" />
      <p>You've already conquered today's Daily Quiz! Wait for tomorrow to earn more Coins.</p>
    </motion.div>
  );
}

export function DashboardHeader({ children }: { children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-end justify-between gap-4"
    >
      {children}
    </motion.div>
  );
}

export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-fuchsia-600/10 blur-[120px] rounded-full animate-float" />
    </div>
  );
}

export function XPProgressBar({ percent }: { percent: number }) {
  return (
     <div className="h-6 w-full bg-zinc-950/50 rounded-full overflow-hidden p-1.5 border border-white/5 shadow-inner">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 bg-[length:200%_100%] animate-gradient-x rounded-full relative overflow-hidden"
      />
    </div>
  );
}

export function CoinBalance({ coins }: { coins: number }) {
  return (
    <motion.span 
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="text-7xl font-black text-white italic tracking-tighter leading-none"
    >
      {coins}
    </motion.span>
  );
}

export function DailyQuizBadge() {
  return (
    <motion.div 
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black uppercase tracking-[0.3em] mb-8"
    >
      <Target className="w-4 h-4" />
      Live Mission
    </motion.div>
  );
}

export function GlobalArenaBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 w-fit">
      <ShieldAlert className="w-4 h-4 animate-pulse" />
      PvP Combat
    </div>
  );
}
