import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";

const prisma = new PrismaClient();

export default async function QuizSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: { questions: true }
  });

  if (!quiz) redirect("/dashboard");

  // Check if already attempted
  const attempt = await prisma.attempt.findFirst({
    where: { userId: session.userId, quizId: quiz.id }
  });

  if (attempt) redirect("/dashboard?error=already_attempted");

  // Strip correct answers before sending to client
  const safeQuestions = quiz.questions.map(q => ({
    id: q.id,
    text: q.text,
    options: JSON.parse(q.options),
    timeLimit: q.timeLimit
  }));

  // Shuffle questions (optional, per requirement: randomize question order)
  const shuffledQuestions = [...safeQuestions].sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      <QuizClient quizId={quiz.id} title={quiz.title} questions={shuffledQuestions} />
    </div>
  );
}
