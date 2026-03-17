import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rewards = await prisma.reward.findMany({
      orderBy: { coinPrice: 'asc' },
    });
    return NextResponse.json({ rewards }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Rewards Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rewards" },
      { status: 500 }
    );
  }
}
