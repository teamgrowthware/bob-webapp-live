import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import ProfileEditClient from "./ProfileEditClient";

const prisma = new PrismaClient();

export default async function ProfileEditPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  let user: any = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) redirect("/login");
  } catch (error) {
    console.error("Profile Edit DB Error:", error);
    // FALLBACK for Demo Mode
    user = {
      name: "Elite Recruiter",
      class: "10",
      school: "Savage High",
      city: "Mumbai",
      state: "Maharashtra",
      dob: "2010-01-01"
    };
  }

  // Normalize data for the form
  const userData = {
    name: user.name || "",
    class: user.class || "10",
    school: user.school || "",
    city: user.city || "",
    state: user.state || "",
    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : ""
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[32px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 blur-[60px] rounded-full" />
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Modify <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Identity</span></h1>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Adjust your deployment credentials</p>
      </div>

      <ProfileEditClient initialData={userData} />
    </div>
  );
}
