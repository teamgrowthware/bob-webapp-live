"use client";

import { Brain, LayoutDashboard, BookOpen, Users, LogOut, Settings, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeacherLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Command Center", icon: <LayoutDashboard size={20} />, href: "/teacher" },
    { label: "Classrooms", icon: <BookOpen size={20} />, href: "/teacher/dashboard" },
    { label: "Squad List", icon: <Users size={20} />, href: "/teacher/students" },
    { label: "Quiz Forge", icon: <Sparkles size={20} />, href: "/teacher/quizzes/forge" },
    { label: "Leaderboards", icon: <Trophy size={20} />, href: "/leaderboard" },
    { label: "Config", icon: <Settings size={20} />, href: "/teacher/settings" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex font-sans selection:bg-violet-500/30">
      {/* Sidebar */}
      <aside className="w-80 border-r border-white/5 bg-zinc-950 flex flex-col sticky top-0 h-screen">
        <div className="p-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-2.5 rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-violet-600/20">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter italic block leading-none">BOB</span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500">Teacher Intel</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${isActive ? "bg-white text-black font-black italic translate-x-2" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}>
                  <span className={`${isActive ? "text-violet-600" : "group-hover:text-violet-400"} transition-colors`}>{item.icon}</span>
                  <span className="uppercase text-xs tracking-widest">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5 space-y-4">
           <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all uppercase text-xs tracking-widest font-black">
              <LogOut size={20} />
              Terminate
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/50 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
