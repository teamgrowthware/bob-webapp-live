import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { generateDoubtExplanation, generateEmbeddings } from "@/lib/ai";

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

    // 1. Vector Search for Curriculum Context (RAG)
    let contextStr = "";
    try {
      const doubtEmbedding = await generateEmbeddings(question);
      const vectorStr = `[${doubtEmbedding.join(",")}]`;

      const relevantChunks = await prisma.$queryRawUnsafe<any[]>(
        `SELECT content, 1 - (embedding <=> $1::vector) as similarity 
         FROM "EmbeddingChunk" 
         ORDER BY embedding <=> $1::vector 
         LIMIT 3`,
        vectorStr
      );

      contextStr = relevantChunks.map(c => c.content).join("\n\n---\n\n");
    } catch (embErr) {
      console.warn("Vector search failed or skipped, falling back to pure LLM:", embErr);
    }

    // 2. Generate explanation from Gemini with Context
    const aiResponse = await generateDoubtExplanation(question, contextStr);

    // 3. Save doubt interaction to database
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
