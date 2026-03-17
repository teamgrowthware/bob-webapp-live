import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Look for today's quiz
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let quiz = await prisma.quiz.findFirst({
      where: { date: { gte: today } },
      include: { questions: true }
    });

    // Seed mock quiz if none exists
    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          title: "Savage Daily Drop #1",
          date: new Date(),
          subject: "General Knowledge & Logic",
          questions: {
            create: [
              {
                text: "What is the square root of 256?",
                options: JSON.stringify(["14", "16", "18", "24"]),
                correctOption: 1, // 0-indexed
                timeLimit: 30
              },
              {
                text: "Which planet has the most moons?",
                options: JSON.stringify(["Jupiter", "Saturn", "Uranus", "Neptune"]),
                correctOption: 1,
                timeLimit: 30
              },
              {
                text: "What does 'HTTP' stand for?",
                options: JSON.stringify(["Hyper Text Transfer Protocol", "High Tier Text Processing", "Hyper Transfer Text Path", "Host Text Terminal Protocol"]),
                correctOption: 0,
                timeLimit: 30
              },
              {
                text: "If a train travels 120km in 2 hours, what is its speed?",
                options: JSON.stringify(["50 km/h", "60 km/h", "70 km/h", "80 km/h"]),
                correctOption: 1,
                timeLimit: 45
              },
              {
                text: "Identify the odd one out.",
                options: JSON.stringify(["Python", "Java", "C++", "HTML"]),
                correctOption: 3,
                timeLimit: 30
              }
            ]
          }
        },
        include: { questions: true }
      });
    }

    // Check if user already attempted
    const attempt = await prisma.attempt.findFirst({
      where: { userId: session.userId, quizId: quiz.id }
    });

    if (attempt) {
      return NextResponse.json({ alreadyAttempted: true });
    }

    // STREAK & REWARD LOGIC
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { streak: true }
    });

    const lastAttempt = await prisma.attempt.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" }
    });

    const now = new Date();
    let newStreak = 1;

    if (lastAttempt) {
      const lastDate = new Date(lastAttempt.createdAt);
      const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays === 1) { // Attempted yesterday
        newStreak = (user?.streak || 0) + 1;
      } else if (diffDays === 0) { // Already attempted today, should not happen here due to `if (attempt)`
        newStreak = user?.streak || 1;
      } else { // Missed a day or more
        newStreak = 1;
      }
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: {
        streak: newStreak,
        xp: { increment: 50 },
        coins: { increment: 10 },
        lastActive: now
      }
    });

    return NextResponse.json({ success: true, quiz: quiz, streak: newStreak });
  } catch (error) {
    console.error("Daily quiz fetch error", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}
