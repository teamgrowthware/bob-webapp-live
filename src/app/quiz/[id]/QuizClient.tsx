"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Timer, Zap, ShieldAlert, Sparkles, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlowCard from "@/components/GlowCard";

type Question = {
  id: string;
  text: string;
  options: string[];
  timeLimit: number;
};

export default function QuizClient({ quizId, title, questions }: { quizId: string, title: string, questions: Question[] }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 30);
  const [answers, setAnswers] = useState<{ questionId: string, selectedOption: number, timeSpent: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(-1); // Auto submit with no answer (-1)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, submitting]);

  const handleNext = async (selectedOptionIndex: number) => {
    if (selectedIdx !== null && selectedOptionIndex !== -1) return;
    
    setSelectedIdx(selectedOptionIndex);
    const timeSpent = currentQ.timeLimit - timeLeft;

    // Small delay for visual feedback
    setTimeout(async () => {
        const newAnswers = [...answers, {
          questionId: currentQ.id,
          selectedOption: selectedOptionIndex,
          timeSpent
        }];

        if (currentIndex < questions.length - 1) {
          setAnswers(newAnswers);
          setCurrentIndex(prev => prev + 1);
          setTimeLeft(questions[currentIndex + 1].timeLimit);
          setSelectedIdx(null);
        } else {
          setAnswers(newAnswers);
          await submitQuiz(newAnswers);
        }
    }, selectedOptionIndex === -1 ? 0 : 600);
  };

  const submitQuiz = async (finalAnswers: any[]) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/quiz/${quizId}/results?score=${data.score}&accuracy=${data.accuracy}`);
      } else {
        router.push("/dashboard?error=submit_failed");
      }
    } catch (err) {
      console.error(err);
      router.push("/dashboard?error=submit_error");
    }
  };

  if (submitting) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950">
        <div className="relative">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-4 border-violet-500/20 border-t-violet-500 rounded-full"
            />
            <Zap className="absolute inset-0 m-auto w-12 h-12 text-violet-500 animate-pulse" />
        </div>
        <h2 className="text-3xl font-black text-white italic mt-10 uppercase tracking-tighter">Uploading Results...</h2>
        <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Your performance is being analyzed</p>
      </div>
    );
  }

  const progressPercent = ((currentIndex) / questions.length) * 100;
  const timePercent = (timeLeft / (currentQ?.timeLimit || 30)) * 100;

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden relative">
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-cyan-600/5 blur-[120px] rounded-full animate-float" />
      </div>

      {/* Top Bar */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 bg-zinc-950/40 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-zinc-900 rounded-xl border border-white/5">
                <Flame className="text-white w-5 h-5" />
            </div>
            <h1 className="font-black text-white uppercase italic tracking-tighter text-lg truncate max-w-[150px] sm:max-w-xs">{title}</h1>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Mission Progress</span>
             <span className="text-white font-black italic">{currentIndex + 1} / {questions.length}</span>
          </div>
          <div className={`flex items-center gap-3 px-6 py-2 rounded-2xl border transition-all ${timeLeft <= 5 ? "bg-red-500 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse" : "bg-white/5 border-white/10 text-white"}`}>
            <Timer className={`w-5 h-5 ${timeLeft <= 5 ? "animate-spin-slow" : ""}`} />
            <span className="font-black text-2xl italic tracking-tighter tabular-nums">00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </header>

      {/* Dynamic Time Bar */}
      <div className="h-1.5 w-full bg-zinc-900 relative z-10">
        <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: `${timePercent}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className={`h-full transition-colors duration-300 ${timeLeft <= 5 ? "bg-red-500" : "bg-cyan-500"}`}
        />
      </div>

      {/* Question Main Area */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-4xl"
          >
            <GlowCard glowColor="violet" animate={false} className="border-0 shadow-none ring-1 ring-white/10">
              <CardContent className="p-10 sm:p-16">
                <div className="flex items-start gap-4 mb-10">
                    <div className="bg-violet-600/20 text-violet-400 p-2 rounded-lg font-black text-xs h-fit">Q{currentIndex + 1}</div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none uppercase italic tracking-tight">
                    {currentQ.text}
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 lg:gap-6 mt-12">
                  {currentQ.options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.02, translateY: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNext(idx)}
                      disabled={selectedIdx !== null}
                      className={`relative w-full text-left p-6 lg:p-10 rounded-[28px] border-2 transition-all group overflow-hidden ${
                        selectedIdx === idx 
                          ? "bg-violet-600 border-violet-400 shadow-[0_0_40px_rgba(139,92,246,0.3)]" 
                          : "bg-zinc-900/50 border-white/5 hover:border-violet-500/50 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="relative z-10 flex items-center gap-6">
                        <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black text-lg italic transition-colors ${
                            selectedIdx === idx ? "bg-white text-violet-600 border-white" : "border-white/10 text-zinc-500 group-hover:border-violet-500 group-hover:text-violet-400"
                        }`}>
                            {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`text-xl lg:text-2xl font-black uppercase italic tracking-tight ${
                            selectedIdx === idx ? "text-white" : "text-zinc-300 group-hover:text-white"
                        }`}>{opt}</span>
                      </div>
                      
                      {/* Pulse effect on select */}
                      {selectedIdx === idx && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 2, opacity: 1 }}
                            className="absolute inset-0 bg-white/20 blur-3xl pointer-events-none"
                          />
                      )}
                    </motion.button>
                  ))}
                </div>

              </CardContent>
            </GlowCard>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Footer Progress */}
      <footer className="h-4 w-full bg-zinc-900 sm:hidden">
         <div className="h-full bg-violet-600" style={{ width: `${progressPercent}%` }} />
      </footer>
    </div>
  );
}
