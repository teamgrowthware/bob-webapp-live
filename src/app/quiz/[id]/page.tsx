import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import QuizClient from "./QuizClient";

const prisma = new PrismaClient();

export default async function QuizSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  let quiz: any = null;
  let alreadyAttempted = false;

  try {
    if (id === "daily-mock") {
      quiz = {
        id: "daily-mock",
        title: "Savage Daily Drop (Demo Mode)",
        questions: [
          { id: "q1", text: "Which is the fastest animal on land?", options: JSON.stringify(["Lion", "Cheetah", "Horse", "Eagle"]), timeLimit: 15 },
          { id: "q2", text: "What is 15 x 15?", options: JSON.stringify(["225", "255", "215", "205"]), timeLimit: 15 }
        ]
      };
    } else {
      quiz = await prisma.quiz.findUnique({
        where: { id },
        include: { questions: true }
      });

      if (quiz) {
        const attempt = await prisma.attempt.findFirst({
          where: { userId: session.userId, quizId: quiz.id }
        });
        if (attempt) alreadyAttempted = true;
      }
    }
  } catch (dbError) {
    console.error("Quiz Session DB Error, using mock:", dbError);
    quiz = {
      id: "daily-mock",
      title: "Savage Daily Drop (Demo Mode)",
      questions: [
        { id: "q1", text: "Which is the fastest animal on land?", options: JSON.stringify(["Lion", "Cheetah", "Horse", "Eagle"]), timeLimit: 15 },
        { id: "q2", text: "What is 15 x 15?", options: JSON.stringify(["225", "255", "215", "205"]), timeLimit: 15 }
      ]
    };
  }

  if (!quiz) redirect("/dashboard");
  if (alreadyAttempted) redirect("/dashboard?error=already_attempted");

  // Strip correct answers before sending to client
  const safeQuestions = quiz.questions.map((q: any) => ({
    id: q.id,
    text: q.text,
    options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
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
