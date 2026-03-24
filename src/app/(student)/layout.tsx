import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import StudentLayoutClient from "./StudentLayoutClient";
import { redirect } from "next/navigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  let user: any = null;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { xp: true, coins: true, name: true, role: true },
    });
  } catch (dbError) {
    console.error("Student Layout DB Error, switching to Fail-Safe:", dbError);
    // Mock user for the nav bar
    user = {
      xp: 1250,
      coins: 450,
      name: "Warrior",
      role: "STUDENT"
    };
  }

  if (!user && !process.env.DATABASE_URL) {
    // If no user and no DB URL, we must be in demo mode
    user = { xp: 1250, coins: 450, name: "Warrior", role: "STUDENT" };
  } else if (!user) {
    redirect("/login");
  }

  return <StudentLayoutClient user={{ ...user, name: user.name || "Student" }}>{children}</StudentLayoutClient>;
}

