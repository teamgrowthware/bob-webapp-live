"use client";

import { useEffect, useState } from "react";
import { Zap, Flame, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        setFeedback("The AI is too stunned to speak. Do better.");
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, []);

  return (
    <Card className={`relative overflow-hidden border-2 transition-all duration-700 ${
      scorePercent < 50 ? "bg-rose-950/20 border-rose-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]" :
      scorePercent < 80 ? "bg-amber-950/20 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]" :
      "bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
    } rounded-[32px]`}>
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <div className={`p-4 rounded-2xl flex items-center justify-center shrink-0 ${
            scorePercent < 50 ? "bg-rose-500 text-white" :
            scorePercent < 80 ? "bg-amber-500 text-white" :
            "bg-emerald-500 text-white"
          }`}>
            <Flame className={`${loading ? "animate-pulse" : ""}`} size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em]">BOB'S VERDICT</h3>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse opacity-50" />
              </div>
            ) : (
              <p className="text-xl font-black text-white italic leading-tight uppercase tracking-tight">
                "{feedback}"
              </p>
            )}
          </div>
        </div>

        {/* Mini stats badges */}
        <div className="flex gap-3 mt-8">
          {[
            { label: "ACCURACY", val: `${accuracy}%`, icon: <Target size={12} /> },
            { label: "STREAK", val: `${streak}d`, icon: <TrendingUp size={12} /> },
            { label: "TIER", val: scorePercent > 80 ? "ELITE" : scorePercent > 50 ? "WOMBAT" : "NOVICE", icon: <Zap size={12} /> },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950/50 border border-zinc-800 rounded-xl">
               <span className="text-zinc-500">{stat.icon}</span>
               <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{stat.val}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Background decoration */}
      <div className={`absolute -right-4 -bottom-4 opacity-10 blur-xl ${
          scorePercent < 50 ? "text-rose-500" : scorePercent < 80 ? "text-amber-500" : "text-emerald-500"
      }`}>
        <Flame size={120} />
      </div>
    </Card>
  );
}
