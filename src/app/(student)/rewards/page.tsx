import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import RewardsClient from "./RewardsClient";

const prisma = new PrismaClient();

export default async function RewardsPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  let user: any = null;
  let rewards: any[] = [];
  let redemptions: any[] = [];

  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) redirect("/login");

    rewards = await prisma.reward.findMany({
      orderBy: { coinPrice: 'asc' },
    });

    redemptions = await prisma.rewardRedemption.findMany({
      where: { userId: user.id },
      include: { reward: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Rewards DB Error:", error);
    // FAIL-SAFE MOCK DATA
    user = user || { id: session.userId, name: "Elite Warrior", coins: 500 };
    rewards = [
      { id: "r1", title: "Elite Hoodie", description: "Exclusive BOB merchandise for top performers.", coinPrice: 2000, image: "/rewards/hoodie.png" },
      { id: "r2", title: "Amazon Voucher", description: "₹500 Gift Card for your next purchase.", coinPrice: 5000, image: "/rewards/amazon.png" },
      { id: "r3", title: "Legendary Badge", description: "A digital badge to showcase on your profile.", coinPrice: 500, image: "/rewards/badge.png" },
    ];
    redemptions = [];
  }

  return (
    <RewardsClient initialRewards={rewards} user={user} initialRedemptions={redemptions} />
  );
}
