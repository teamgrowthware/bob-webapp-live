import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { generateDoubtExplanation } from "@/lib/ai";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question } = await req.json();
    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // 1. Generate explanation from Gemini
    const aiResponse = await generateDoubtExplanation(question);

    // 2. Save doubt interaction to database
    const doubt = await prisma.doubt.create({
      data: {
        userId: session.userId,
        question,
        aiResponse,
        status: "UNVERIFIED"
      }
    });

    return NextResponse.json({ success: true, doubt }, { status: 201 });
  } catch (error: any) {
    console.error("AI Doubt API Error:", error);
    return NextResponse.json(
      { error: "Failed to process doubt." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch student's own doubts
    const doubts = await prisma.doubt.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ doubts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch doubts." },
      { status: 500 }
    );
  }
}
