import Link from "next/link";
import { Brain, LayoutDashboard, Library, Users, Trophy, Settings, LogOut, Sparkles } from "lucide-react";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-2 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter">BOB <span className="text-zinc-500 font-bold text-sm">TEACHER</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link href="/teacher">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900 text-white font-bold transition-all cursor-pointer">
              <LayoutDashboard size={20} className="text-violet-400" />
              Overview
            </div>
          </Link>
          <Link href="/teacher/quizzes">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-bold">
              <Library size={20} />
              Quizzes
            </div>
          </Link>
          <Link href="/teacher/quizzes/forge">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-bold">
              <Sparkles size={20} />
              Quiz Forge
            </div>
          </Link>
          <Link href="/teacher/students">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-bold">
              <Users size={20} />
              Students
            </div>
          </Link>
          <Link href="/teacher/leaderboard">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-bold">
              <Trophy size={20} />
              School Board
            </div>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-900">
           <Link href="/login">
             <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all cursor-pointer font-bold">
               <LogOut size={20} />
               Sign Out
             </div>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
