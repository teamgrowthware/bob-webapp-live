import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import QuizForge from "./QuizForge";

export default async function QuizForgePage() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") redirect("/login");

  return (
    <div className="p-8">
      <QuizForge />
    </div>
  );
}
