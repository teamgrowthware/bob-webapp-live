import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import DoubtsClient from "./DoubtsClient";

const prisma = new PrismaClient();

export default async function DoubtsPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const doubts = await prisma.doubt.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' }
  });

  return <DoubtsClient initialDoubts={doubts} />;
}
