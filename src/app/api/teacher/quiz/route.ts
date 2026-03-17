import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { title, subject, questions } = await request.json();

    const quiz = await prisma.quiz.create({
      data: {
        title,
        subject,
        date: new Date(),
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctOption: q.correctOption,
            timeLimit: 30
          }))
        }
      }
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error) {
    console.error("Failed to create quiz", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
