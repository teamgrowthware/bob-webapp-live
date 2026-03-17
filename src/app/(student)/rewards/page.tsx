import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import RewardsClient from "./RewardsClient";

const prisma = new PrismaClient();

export default async function RewardsPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user) redirect("/login");

  const rewards = await prisma.reward.findMany({
    orderBy: { coinPrice: 'asc' },
  });

  const redemptions = await prisma.rewardRedemption.findMany({
    where: { userId: user.id },
    include: { reward: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <RewardsClient initialRewards={rewards} user={user} initialRedemptions={redemptions} />
  );
}
