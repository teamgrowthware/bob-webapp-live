"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DailyQuizRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    async function fetchDailyQuiz() {
      try {
        const res = await fetch("/api/quiz/daily");
        const data = await res.json();

        if (data.alreadyAttempted) {
          router.push("/dashboard?error=already_attempted");
          return;
        }

        if (data.success && data.quiz?.id) {
          router.push("/quiz/" + data.quiz.id);
        } else {
          console.error("Failed to load daily quiz", data);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching daily quiz", error);
        router.push("/dashboard");
      }
    }

    fetchDailyQuiz();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#111116] flex flex-col items-center justify-center text-white">
       <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
       <h1 className="text-2xl font-black italic tracking-tight uppercase">Initializing Daily Savage Quiz...</h1>
       <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Prepare for glory</p>
    </div>
  );
}
