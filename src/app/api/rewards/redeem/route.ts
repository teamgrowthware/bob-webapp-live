import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, rewardId } = await req.json();

    if (!userId || !rewardId) {
      return NextResponse.json({ error: "Missing identity or treasure ID." }, { status: 400 });
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get user and reward
      const user = await tx.user.findUnique({ where: { id: userId } });
      const reward = await tx.reward.findUnique({ where: { id: rewardId } });

      if (!user || !reward) {
        throw new Error("Target not found in registry.");
      }

      // 2. Check coins and stock
      if (user.coins < reward.coinPrice) {
        throw new Error("Insufficient BOB Coins. Win more battles.");
      }
      if (reward.stock <= 0) {
        throw new Error("Loot out of stock. Mission aborted.");
      }

      // 3. Deduct coins and stock
      await tx.user.update({
        where: { id: userId },
        data: { coins: { decrement: reward.coinPrice } }
      });

      await tx.reward.update({
        where: { id: rewardId },
        data: { stock: { decrement: 1 } }
      });

      // 4. Create redemption record
      const redemption = await tx.rewardRedemption.create({
        data: {
          userId,
          rewardId,
          status: "PENDING"
        },
        include: {
          reward: true
        }
      });

      return redemption;
    });

    return NextResponse.json({ success: true, redemption: result });
  } catch (error: any) {
    console.error("Redemption Error:", error);
    return NextResponse.json({ error: error.message || "System failure during loot extraction." }, { status: 500 });
  }
}
