import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) redirect("/login");

  // Fetch some stats
  const attempts = await prisma.attempt.count({
    where: { userId: user.id }
  });

  const redemptions = await prisma.rewardRedemption.count({
    where: { userId: user.id }
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
        <h1 className="text-3xl font-black text-white">Your Profile</h1>
        <p className="text-zinc-400 mt-1">Manage your identity and track your legendary stats.</p>
      </div>

      <ProfileClient 
        user={user} 
        stats={{ attempts, redemptions }} 
      />
    </div>
  );
}
