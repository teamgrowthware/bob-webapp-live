import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { status, code } = await req.json();

    const redemption = await prisma.rewardRedemption.update({
      where: { id },
      data: {
        status,
        code,
      },
    });

    return NextResponse.json(redemption);
  } catch (error: any) {
    console.error("Update Redemption Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update redemption" }, { status: 500 });
  }
}
