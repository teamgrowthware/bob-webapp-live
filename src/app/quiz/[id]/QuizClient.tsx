"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, Zap, CheckCircle2 } from "lucide-react";

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
    const timeSpent = currentQ.timeLimit - timeLeft;

    const newAnswers = [...answers, {
      questionId: currentQ.id,
      selectedOption: selectedOptionIndex,
      timeSpent
    }];

    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(questions[currentIndex + 1].timeLimit);
    } else {
      // Finished
      setAnswers(newAnswers);
      await submitQuiz(newAnswers);
    }
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
        // For MVP, we pass random-ish but representative stats to results
        const score = Math.floor(Math.random() * 40) + 60; // Mock score 60-100%
        const accuracy = Math.floor(Math.random() * 20) + 80; // Mock accuracy 80-100%
        router.push(`/quiz/${quizId}/results?score=${score}&accuracy=${accuracy}`);
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
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Zap className="w-12 h-12 text-violet-500 animate-pulse mb-4" />
        <h2 className="text-2xl font-bold">Calculating your savagery...</h2>
      </div>
    );
  }

  const progressPercent = ((currentIndex) / questions.length) * 100;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <h1 className="font-bold text-zinc-300 truncate max-w-[200px] sm:max-w-xs">{title}</h1>
        <div className="flex items-center gap-6">
          <div className="text-sm font-medium text-zinc-400">
            {currentIndex + 1} / {questions.length}
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-lg ${timeLeft <= 5 ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-cyan-500/10 text-cyan-400"}`}>
            <Timer className="w-4 h-4" />
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-zinc-900">
        <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Question Main Area */}
      <main className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <Card className="w-full max-w-3xl bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardContent className="p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-8">
              {currentQ.text}
            </h2>

            <div className="grid gap-3 sm:gap-4">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNext(idx)}
                  className="w-full text-left p-4 sm:p-5 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-violet-600/20 hover:border-violet-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all group flex justify-between items-center"
                >
                  <span className="text-lg font-medium text-zinc-200 group-hover:text-white">{opt}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-600 group-hover:border-violet-400 flex items-center justify-center">
                    <div className="w-3 h-3 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}
