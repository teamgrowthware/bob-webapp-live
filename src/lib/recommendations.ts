import { prisma } from "./prisma";
import { generateEmbeddings } from "./ai";

export async function getRecommendations(userId: string) {
  try {
    // 1. Fetch weak topics (accuracy < 60%)
    const attempts = await prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        quiz: {
          select: { subject: true, title: true }
        }
      }
    });

    // Simple heuristic: if most recent few attempts on a subject/topic are < 60%
    const weakSubjects = Array.from(new Set(attempts
      .filter(a => a.accuracy < 60)
      .map(a => a.quiz?.subject)
      .filter(Boolean) as string[]
    ));

    const targetSubject = weakSubjects[0] || "General";

    // 2. Perform Vector Search based on weak subject
    const queryEmbedding = await generateEmbeddings(`Key concepts and detailed explanation for ${targetSubject}`);
    const vectorStr = `[${queryEmbedding.join(",")}]`;

    // Retrieve top relevant chunks from any textbook
    // Note: This requires pgvector extension in the database
    const recommendations = await prisma.$queryRawUnsafe<any[]>(
      `SELECT c.content, c."chapterId", ch.title as "chapterTitle", t.name as "textbookName", t.subject, t.class
       FROM "EmbeddingChunk" c
       JOIN "Chapter" ch ON c."chapterId" = ch.id
       JOIN "Textbook" t ON ch."textbookId" = t.id
       ORDER BY c.embedding <=> $1::vector 
       LIMIT 5`,
      vectorStr
    );

    return recommendations;

  } catch (error: any) {
    console.error("Recommendations Logic Error:", error);
    return [];
  }
}
