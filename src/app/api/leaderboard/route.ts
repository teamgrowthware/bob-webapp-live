import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 50,
      select: { 
        id: true, 
        name: true, 
        xp: true, 
        level: true, 
        school: true 
      }
    });

    return NextResponse.json({ topUsers });
  } catch (error) {
    console.error("Leaderboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
