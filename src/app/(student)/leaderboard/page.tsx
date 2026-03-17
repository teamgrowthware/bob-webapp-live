import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import LeaderboardClient from "./LeaderboardClient";

const prisma = new PrismaClient();

export default async function LeaderboardPage() {
  // In a real app, we'd get the session user. Mocking for now.
  const userCity = "Mumbai"; 

  const topUsers = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 50,
    select: { id: true, name: true, xp: true, level: true, school: true, city: true, isFeatured: true }
  });

  return (
    <LeaderboardClient initialUsers={topUsers} userCity={userCity} />
  );
}
