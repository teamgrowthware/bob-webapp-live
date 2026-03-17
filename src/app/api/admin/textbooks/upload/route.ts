import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import pdf from "pdf-parse";
import { chunkText } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/ai";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textbookName = formData.get("name") as string | null;
    const classLevel = formData.get("class") as string | null;
    const subject = formData.get("subject") as string | null;

    if (!file || !textbookName || !classLevel || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), "public/uploads/textbooks");
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // 2. Extract Text
    const data = await pdf(buffer);
    const rawText = data.text;

    // 3. Simple Chapter Detection (MVP: One big chapter if not found)
    const chapterName = "Full Content"; 
    
    // @ts-ignore - textbook model exists after generate
    const textbook = await prisma.textbook.create({
      data: {
        name: textbookName,
        class: classLevel,
        subject: subject,
        chapters: {
          create: [{ title: chapterName }]
        }
      },
      include: {
        chapters: true
      }
    });

    const chapter = textbook.chapters[0];

    // 4. Chunking
    const chunks = chunkText(rawText);

    // 5. Embed & Store
    console.log(`Processing ${chunks.length} chunks for ${textbookName}...`);

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      
      const embedding = await generateEmbeddings(chunk);
      
      await prisma.$executeRawUnsafe(
        `INSERT INTO "EmbeddingChunk" ("id", "chapterId", "content", "embedding") 
         VALUES ($1, $2, $3, $4::vector)`,
        crypto.randomUUID(),
        chapter.id,
        chunk,
        `[${embedding.join(",")}]`
      );
    }

    return NextResponse.json({ 
      success: true, 
      textbookId: textbook.id,
      chunksProcessed: chunks.length 
    });

  } catch (error: any) {
    console.error("Ingestion Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process textbook" }, { status: 500 });
  }
}
