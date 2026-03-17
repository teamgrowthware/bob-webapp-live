import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        subject: true,
        createdAt: true
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}
