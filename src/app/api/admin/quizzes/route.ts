import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quizzes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        subject: data.subject || data.category,
        isPremium: data.isPremium || false,
        questions: {
          create: data.questions.map((q: any) => ({
            text: q.text,
            options: typeof q.options === 'string' ? q.options : JSON.stringify(q.options),
            correctIdx: q.correctIdx ?? q.correctOption,
            explanation: q.explanation
          })),
        },
      },
    });
    return NextResponse.json(quiz);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
    try {
        const { id, isDaily, date } = await req.json();
        // For simplicity, just update the quiz metadata
        // In a real app, you might have a DailyQuiz junction table
        const quiz = await prisma.quiz.update({
            where: { id },
            data: { 
                // Using tags or specific logic for MVP
                title: isDaily ? `[DAILY] ${date}: ${id}` : id
            }
        });
        return NextResponse.json(quiz);
    } catch (e) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
