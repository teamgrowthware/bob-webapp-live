import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { status, code } = await req.json();

    const result = await prisma.$transaction(async (tx) => {
      const redemption = await tx.rewardRedemption.findUnique({
        where: { id },
        include: { reward: true }
      });

      if (!redemption) throw new Error("Redemption not found");

      if (redemption.status === "PENDING" && status === "REJECTED") {
        await tx.user.update({
          where: { id: redemption.userId },
          data: { coins: { increment: redemption.reward.coinPrice } }
        });
        await tx.reward.update({
          where: { id: redemption.rewardId },
          data: { stock: { increment: 1 } }
        });
      }

      const updated = await tx.rewardRedemption.update({
        where: { id },
        data: {
          status,
          code: code !== undefined ? code : redemption.code,
        },
      });

      return updated;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Update Redemption Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update redemption" }, { status: 500 });
  }
}
