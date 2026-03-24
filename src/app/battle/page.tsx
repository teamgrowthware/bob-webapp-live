
import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import BattleClient from "./BattleClient";

const prisma = new PrismaClient();

export default async function BattlePage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, streak: true }
  });

  if (!user || !user.name) redirect("/onboarding");

  return <BattleClient currentUser={{ id: user.id, name: user.name, streak: user.streak }} />;
}
