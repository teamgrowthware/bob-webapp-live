"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, Trophy, Gift, Settings, LogOut, BarChart2 } from "lucide-react";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Global Intel", href: "/admin", icon: LayoutDashboard },
    { name: "User Base", href: "/admin/users", icon: Users },
    { name: "Mission Control", href: "/admin/quizzes", icon: BookOpen },
    { name: "Global Ranks", href: "/admin/leaderboard", icon: Trophy },
    { name: "Rewards Forge", href: "/admin/rewards", icon: Gift },
    { name: "System Config", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex font-sans">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col sticky top-0 h-screen p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-rose-600 p-2 rounded-xl">
             <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl italic uppercase tracking-tighter">BOB ADMIN</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-rose-600 text-white font-black italic shadow-lg shadow-rose-600/20" : "text-zinc-500 hover:text-white hover:bg-zinc-900"}`}>
                <item.icon className="w-5 h-5" />
                <span className="text-xs uppercase font-black tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs uppercase font-black tracking-widest mt-auto">
          <LogOut className="w-5 h-5" />
          Terminate session
        </button>
      </aside>
      
      <main className="flex-1 p-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-rose-900/10 via-transparent to-transparent">
        {children}
      </main>
    </div>
  );
}
