import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redemptions = await prisma.rewardRedemption.findMany({
      include: {
        user: {
          select: { name: true, phone: true }
        },
        reward: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(redemptions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch redemptions" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    const redemption = await prisma.rewardRedemption.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(redemption);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update redemption" }, { status: 500 });
  }
}
