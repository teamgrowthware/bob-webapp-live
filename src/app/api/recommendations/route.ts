import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateEmbeddings } from "@/lib/ai";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { getRecommendations } = await import("@/lib/recommendations");
    const recommendations = await getRecommendations(session.userId);
    return NextResponse.json(recommendations);

  } catch (error: any) {
    console.error("Recommendations Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
