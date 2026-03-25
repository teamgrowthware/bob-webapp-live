import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import LeaderboardClient from "./LeaderboardClient";

const prisma = new PrismaClient();

export default async function LeaderboardPage() {
  // In a real app, we'd get the session user. Mocking for now.
  const userCity = "Mumbai"; 

  let topUsers: any[] = [];
  try {
    topUsers = await prisma.user.findMany({
      orderBy: { xp: "desc" },
      take: 50,
      select: { id: true, name: true, xp: true, level: true, school: true, city: true, isFeatured: true }
    });
  } catch (error) {
    console.error("Leaderboard DB Error:", error);
    // FAIL-SAFE MOCK DATA
    topUsers = [
      { id: "m1", name: "Savage Warrior", xp: 15000, level: 25, school: "Elite Academy", city: "Mumbai", isFeatured: true },
      { id: "m2", name: "Cyber Ninja", xp: 12500, level: 22, school: "Tech High", city: "Delhi", isFeatured: false },
      { id: "m3", name: "Brain Destroyer", xp: 11000, level: 20, school: "Global School", city: "Bangalore", isFeatured: false },
      { id: "m4", name: "Math Wizard", xp: 9500, level: 18, school: "Science Inst", city: "Pune", isFeatured: false },
      { id: "m5", name: "Quiz Lord", xp: 8000, level: 15, school: "City Public", city: "Mumbai", isFeatured: false },
    ];
  }

  return (
    <LeaderboardClient initialUsers={topUsers} userCity={userCity} />
  );
}
