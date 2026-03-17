"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function QuizRedirectPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchDailyQuiz() {
      try {
        const res = await fetch("/api/quiz/daily")
        const data = await res.json()

        if (!res.ok) throw new Error(data.error || "Failed to fetch quiz")

        if (data.alreadyAttempted) {
          router.replace("/dashboard?error=already_attempted")
          return
        }

        if (data.quiz) {
          router.replace(`/quiz/${data.quiz.id}`)
        }
      } catch (err: any) {
        setError(err.message)
      }
    }

    fetchDailyQuiz()
  }, [router])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl max-w-md text-center">{error}</div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          <p className="font-medium animate-pulse">Summoning today's battle...</p>
        </div>
      )}
    </div>
  )
}
