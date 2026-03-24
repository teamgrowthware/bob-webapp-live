import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      studentCount,
      schoolCount,
      waitlistCount,
      quizCount,
      attemptsToday,
      dauCount,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TEACHER" } }),
      prisma.waitlist.count(),
      prisma.quiz.count(),
      prisma.attempt.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.user.count({
        where: {
          role: "STUDENT",
          lastActive: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    const participationRate = studentCount > 0 ? (attemptsToday / studentCount) * 100 : 0;

    return NextResponse.json({
      students: studentCount,
      schools: schoolCount,
      waitlist: waitlistCount,
      quizzes: quizCount,
      todayAttempts: attemptsToday,
      dau: dauCount,
      participationRate: Math.round(participationRate * 10) / 10,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
