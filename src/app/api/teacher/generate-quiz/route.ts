import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { generateQuizQuestions } from "@/lib/ai";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    // Minimal check, ideally we check for Teacher/Admin Role
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { topic, classLevel, count, context } = body;

    if (!topic || !classLevel) {
      return NextResponse.json({ error: "Missing topic or classLevel" }, { status: 400 });
    }

    const questionCount = count ? parseInt(count) : 5;

    // 1. Generate questions using Gemini AI
    const aiQuestions = await generateQuizQuestions(topic, classLevel, questionCount, context);

    if (!aiQuestions || aiQuestions.length === 0) {
      return NextResponse.json({ error: "Failed to generate usable questions" }, { status: 500 });
    }

    // 2. Insert Quiz directly into Database
    const newQuiz = await prisma.quiz.create({
      data: {
        title: `AI: ${topic}`,
        subject: "General",
        date: new Date().toISOString().split('T')[0],
        questions: {
          create: aiQuestions.map((q) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctOption: q.correctOption,
            timeLimit: q.timeLimit || 30, // Default 30s
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json({ success: true, quiz: newQuiz }, { status: 201 });
  } catch (error: any) {
    console.error("AI Generate API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
