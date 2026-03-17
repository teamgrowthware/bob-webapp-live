import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateEmbeddings } from "@/lib/ai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { chapterId, difficulty, count, topic } = await req.json();

    if (!chapterId) {
      return NextResponse.json({ error: "Please select a textbook chapter." }, { status: 400 });
    }

    // 1. Generate Query Embedding
    // We use the topic or chapter title as the search query
    const queryEmbedding = await generateEmbeddings(topic || "Summary of chapter content");

    // 2. Similarity Search (RAG)
    // We search for the top 5 most relevant chunks in this specific chapter
    const vectorStr = `[${queryEmbedding.join(",")}]`;
    const relevantChunks = await prisma.$queryRawUnsafe<any[]>(
      `SELECT content, 1 - (embedding <=> $1::vector) as similarity 
       FROM "EmbeddingChunk" 
       WHERE "chapterId" = $2 
       ORDER BY embedding <=> $1::vector 
       LIMIT 5`,
      vectorStr,
      chapterId
    );

    const context = relevantChunks.map(c => c.content).join("\n\n---\n\n");

    if (!context) {
      return NextResponse.json({ error: "No curriculum context found for this chapter. Please upload the textbook first." }, { status: 404 });
    }

    // 3. Generate Quiz with Gemini 1.5 Pro (High Reasoning)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are an elite curriculum engineer for "Battle of Brains".
      Your mission: Forge a ${difficulty} difficulty quiz with exactly ${count || 5} MCQs.
      
      CRITICAL RULE: Every question MUST be strictly based on the provided CURRICULUM CONTEXT. Do not use outside knowledge.
      
      CURRICULUM CONTEXT:
      """
      ${context}
      """
      
      JSON FORMAT REQUIREMENT:
      Return a JSON object with a "questions" array. Each object in the array must have:
      - "text": The question.
      - "options": Array of 4 strings.
      - "correctIdx": Integer (0-3).
      - "explanation": Why it's correct (cite the context).

      Generate the quiz now:
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean JSON
    let cleanJsonStr = text.trim().replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    const generatedQuiz = JSON.parse(cleanJsonStr);

    return NextResponse.json(generatedQuiz);

  } catch (error: any) {
    console.error("Quiz Forge Error:", error);
    return NextResponse.json({ error: error.message || "Forge failed to ignite." }, { status: 500 });
  }
}
