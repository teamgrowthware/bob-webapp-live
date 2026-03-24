"use client";

import { useEffect, useState } from "react";
import { Zap, Flame, Target, TrendingUp, Sparkles } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface SavageFeedbackProps {
  scorePercent: number;
  accuracy: number;
  subject: string;
  streak: number;
  name: string;
}

export default function SavageFeedback({ scorePercent, accuracy, subject, streak, name }: SavageFeedbackProps) {
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch("/api/ai/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scorePercent, accuracy, subject, streak, name }),
        });
        const data = await res.json();
        setFeedback(data.feedback);
      } catch (err) {
        setFeedback("The AI is too stunned to speak. You're a savage.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, []);

  const themeColor = scorePercent < 50 ? "rose" : scorePercent < 80 ? "amber" : "emerald";
  const glowClass = scorePercent < 50 ? "neon-glow-rose" : scorePercent < 80 ? "neon-glow-amber" : "neon-glow-emerald";

  return (
    <div className={`relative overflow-hidden rounded-[32px] border-2 transition-all duration-1000 bg-zinc-950/40 backdrop-blur-xl ${
      scorePercent < 50 ? "border-rose-500/30 shadow-[0_0_40px_rgba(239,68,68,0.1)]" :
      scorePercent < 80 ? "border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.1)]" :
      "border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
    }`}>
      <CardContent className="p-8 sm:p-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`p-6 rounded-[28px] flex items-center justify-center shrink-0 shadow-2xl ${
            scorePercent < 50 ? "bg-rose-600 text-white" :
            scorePercent < 80 ? "bg-amber-500 text-black" :
            "bg-emerald-500 text-black"
          }`}>
            <Flame className={`${loading ? "animate-pulse" : ""}`} size={32} />
          </motion.div>
          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
                <Sparkles size={14} className={scorePercent < 80 ? "text-amber-500" : "text-emerald-500"} />
                <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em]">SQUAD INTEL REPORT</h3>
            </div>
            {loading ? (
              <div className="space-y-3">
                <div className="h-6 w-64 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-4 w-48 bg-zinc-800 rounded-full animate-pulse opacity-50" />
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-black text-white italic leading-tight uppercase tracking-tight"
              >
                "{feedback}"
              </motion.p>
            )}
          </div>
        </div>

        {/* Mini stats badges */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-10">
          {[
            { label: "ACCURACY", val: `${accuracy}%`, icon: <Target size={14} /> },
            { label: "STREAK", val: `${streak} DAYS`, icon: <TrendingUp size={14} /> },
            { label: "TIER", val: scorePercent > 80 ? "ELITE" : scorePercent > 50 ? "WARRIOR" : "RECRUIT", icon: <Zap size={14} /> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-2.5 bg-zinc-950/50 border border-white/5 rounded-2xl shadow-inner group hover:border-white/10 transition-colors">
               <span className="text-zinc-500 group-hover:text-white transition-colors">{stat.icon}</span>
               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{stat.val}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Background decoration */}
      <div className={`absolute -right-10 -bottom-10 opacity-10 blur-3xl pointer-events-none ${
          scorePercent < 50 ? "text-rose-500" : scorePercent < 80 ? "text-amber-500" : "text-emerald-500"
      }`}>
        <Flame size={200} />
      </div>
    </div>
  );
}
