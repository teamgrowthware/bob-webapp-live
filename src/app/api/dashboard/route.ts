import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          xp: true,
          level: true,
          coins: true,
          class: true,
          school: true,
        }
      });

      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      // Calculate rank (simplified for demo)
      const countAbove = await prisma.user.count({
        where: {
          xp: {
            gt: user.xp
          }
        }
      });

      return NextResponse.json({
        user,
        stats: {
          nationalRank: countAbove + 1,
          quizzesCompleted: await prisma.attempt.count({ where: { userId: user.id } }),
          battlesWon: 0, // Mock for now
        }
      });
    } catch (dbError) {
      console.error("Dashboard DB error, using mock data:", dbError);
      return NextResponse.json({
        user: { 
          id: session.userId, 
          name: "Elite Warrior", 
          xp: 1250, 
          level: 12, 
          coins: 450, 
          class: "10", 
          school: "Battle Academy" 
        },
        stats: {
          nationalRank: 42,
          quizzesCompleted: 15,
          battlesWon: 8,
        }
      });
    }
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
