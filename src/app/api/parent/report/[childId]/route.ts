import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { childId: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PARENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { childId } = params;

    // Verify ownership
    const child = await prisma.user.findFirst({
      where: { id: childId, parentId: session.userId }
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found or not linked" }, { status: 404 });
    }

    // Fetch quiz attempts for the last 30 days
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const attempts = await prisma.attempt.findMany({
      where: {
        userId: childId,
        createdAt: { gte: lastMonth }
      },
      include: {
        quiz: { select: { subject: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    // Aggregate by subject
    const subjectStats: Record<string, { total: number; scoreSum: number; count: number }> = {};
    attempts.forEach(a => {
      const subject = a.quiz.subject || "General";
      if (!subjectStats[subject]) {
        subjectStats[subject] = { total: 0, scoreSum: 0, count: 0 };
      }
      subjectStats[subject].scoreSum += a.accuracy;
      subjectStats[subject].count += 1;
    });

    const report = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      avgAccuracy: stats.scoreSum / stats.count,
      totalQuizzes: stats.count
    }));

    return NextResponse.json({
      childName: child.name,
      report,
      totalXP: child.xp,
      weeklyXP: child.weeklyXp,
      recentAttempts: attempts.slice(0, 10)
    });
  } catch (error) {
    console.error("Parent report error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
