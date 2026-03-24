import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { answers } = await request.json(); // Array of { questionId, selectedOption, timeSpent }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    // Ensure user hasn't attempted yet (Anti-cheat)
    const existingAttempt = await prisma.attempt.findFirst({
      where: { userId: session.userId, quizId: quiz.id }
    });

    if (existingAttempt) {
      return NextResponse.json({ error: "Already attempted" }, { status: 403 });
    }

    let correctCount = 0;
    let totalScore = 0;
    let totalTimeSpent = 0;

    // SCORING LOGIC
    // Base 100 XP per correct. Bonus Max 50 XP for speed per question.
    for (const ans of answers) {
      const q = quiz.questions.find(x => x.id === ans.questionId);
      if (q) {
        totalTimeSpent += ans.timeSpent;
        if (ans.selectedOption === q.correctIdx) {
          correctCount++;
          let speedBonus = Math.floor(Math.max(0, ((q.timeLimit - ans.timeSpent) / q.timeLimit) * 50));
          totalScore += (100 + speedBonus);
        }
      }
    }

    const accuracy = (correctCount / quiz.questions.length) * 100;
    const coinsEarned = Math.floor((accuracy / 100) * 50); // Max 50 coins

    // Transaction to update User and create Attempt
    await prisma.$transaction(async (tx) => {
      const u = await tx.user.findUnique({ where: { id: session.userId } });
      if (!u) throw new Error("User not found");

      let newXp = u.xp + totalScore;
      let newLevel = Math.max(1, Math.floor(newXp / 1000) + 1);

      await tx.user.update({
        where: { id: session.userId },
        data: {
          xp: newXp,
          coins: u.coins + coinsEarned,
          level: newLevel
        }
      });

      await tx.attempt.create({
        data: {
          userId: session.userId,
          quizId: quiz.id,
          score: totalScore,
          accuracy,
          timeSpent: totalTimeSpent
        }
      });

      // PARENT NOTIFICATIONS
      if (u.parentId) {
        if (accuracy < 50) {
          await tx.notification.create({
            data: {
              userId: u.parentId,
              title: "Performance Alert ⚠️",
              message: `${u.name} scored ${accuracy.toFixed(1)}% in ${quiz.title}. They might need help with ${quiz.subject}.`,
              type: "PERFORMANCE"
            }
          });
        } else if (accuracy > 90) {
          await tx.notification.create({
            data: {
              userId: u.parentId,
              title: "Big Win! 🏆",
              message: `${u.name} crushed it with ${accuracy.toFixed(1)}% in ${quiz.title}!`,
              type: "ACHIEVEMENT"
            }
          });
        }
      }
    });

    return NextResponse.json({ success: true, score: totalScore, coinsEarned, accuracy });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Submit failed" }, { status: 500 });
  }
}
