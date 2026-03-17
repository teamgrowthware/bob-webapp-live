import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { classId, quizId, dueDate } = await req.json();
    if (!classId || !quizId) return NextResponse.json({ error: "Class and Quiz required" }, { status: 400 });

    const assignment = await prisma.assignment.create({
      data: {
        classId,
        quizId,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
  }
}
