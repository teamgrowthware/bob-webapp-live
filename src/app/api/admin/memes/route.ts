import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const memes = await prisma.memeTemplate.findMany({
      orderBy: { minScore: "asc" }
    });
    return NextResponse.json(memes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { imageUrl, minScore, maxScore, tone } = await req.json();
    const meme = await prisma.memeTemplate.create({
      data: {
        imageUrl,
        minScore: parseInt(minScore),
        maxScore: parseInt(maxScore),
        tone
      }
    });
    return NextResponse.json(meme);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
