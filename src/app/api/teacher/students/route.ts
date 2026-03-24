import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const classes = await prisma.classroom.findMany({
      where: { teacherId: session.userId },
      select: { id: true, name: true }
    });

    if (classes.length === 0) {
      return NextResponse.json([]);
    }

    const classIds = classes.map(c => c.id);

    const enrollments = await prisma.enrollment.findMany({
      where: { classId: { in: classIds } },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            class: true,
            xp: true,
            coins: true,
            lastActive: true,
            attempts: {
              select: { accuracy: true }
            }
          }
        },
        classroom: { select: { name: true } }
      }
    });

    const studentsData = enrollments.map(e => {
      const s = e.student;
      let avgAccuracy = 0;
      if (s.attempts && s.attempts.length > 0) {
        const sum = s.attempts.reduce((acc, curr) => acc + curr.accuracy, 0);
        avgAccuracy = Math.round(sum / s.attempts.length);
      }

      return {
        id: s.id,
        name: s.name || "Unknown Pupil",
        class: e.classroom.name,
        xp: s.xp,
        coins: s.coins,
        accuracy: `${avgAccuracy}%`,
        rank: 0, 
        lastActive: s.lastActive ? new Date(s.lastActive).toLocaleDateString() : "Never active"
      };
    });

    studentsData.sort((a, b) => b.xp - a.xp);
    studentsData.forEach((s, idx) => s.rank = idx + 1);

    return NextResponse.json(studentsData);
  } catch (error: any) {
    console.error("Teacher/Students GET Error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch students" }, { status: 500 });
  }
}
