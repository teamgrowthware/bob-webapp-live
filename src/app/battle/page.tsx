
import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import BattleClient from "./BattleClient";

const prisma = new PrismaClient();

export default async function BattlePage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  let user: any = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, streak: true }
    });
  } catch (error) {
    console.error("Battle DB Error:", error);
  }

  // Fallback if DB is down or user not found
  if (!user || !user.name) {
    user = { id: session.userId, name: "Elite Warrior", streak: 5 };
  }

  return <BattleClient currentUser={{ id: user.id, name: user.name, streak: user.streak }} />;
}
