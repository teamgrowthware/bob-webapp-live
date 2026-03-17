"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Trophy, Gift, User, LogOut, Bot } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { name: "Rewards", href: "/rewards", icon: Gift },
    { name: "Doubts", href: "/doubts", icon: Bot },
    { name: "Profile", href: "/profile", icon: User },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800 bg-zinc-950/50 p-4">
        <div className="mb-8 px-4 flex items-center gap-2">
          <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-1.5 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">BOB Student</span>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? "bg-violet-600/10 text-violet-400 font-semibold" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"}`}>
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 mt-auto transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800 z-50 px-6 py-4 pb-safe flex justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center gap-1 ${isActive ? "text-violet-400" : "text-zinc-500"}`}>
              <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-violet-600/20" : ""}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
