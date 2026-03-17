import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import TeacherDoubtsClient from "./TeacherDoubtsClient";

const prisma = new PrismaClient();

export default async function TeacherDoubtsPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || (user.role !== "TEACHER" && user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const doubts = await prisma.doubt.findMany({
    include: {
      user: { select: { name: true, phone: true, school: true, class: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
        <h1 className="text-3xl font-black text-white">AI Doubt Oversight</h1>
        <p className="text-zinc-400 mt-1">Review Gemini's answers. Verify them for the FAQ, or flag and correct them pedagogically.</p>
      </div>
      <TeacherDoubtsClient initialDoubts={doubts} />
    </div>
  );
}
