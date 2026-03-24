import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import StudentLayoutClient from "./StudentLayoutClient";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { xp: true, coins: true, name: true, role: true },
  });

  if (!user) redirect("/login");

  return <StudentLayoutClient user={{ ...user, name: user.name || "Student" }}>{children}</StudentLayoutClient>;
}

