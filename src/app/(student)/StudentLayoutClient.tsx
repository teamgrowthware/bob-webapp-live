"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Swords, Calendar, Gift, User, Settings, HelpCircle, LogOut } from "lucide-react";

type UserProps = {
  xp: number;
  coins: number;
  name: string;
  role: string;
};

export default function StudentLayoutClient({ children, user }: { children: React.ReactNode, user: UserProps }) {
  const pathname = usePathname();
  const router = useRouter();

  const topNavItems = [
    { name: "HOME", href: "/dashboard" },
    { name: "BATTLES", href: "/battle" },
    { name: "TIMETABLE", href: "/dashboard" }, // Typically points to timetable section, using dashboard for now
    { name: "REWARDS", href: "/rewards" },
    { name: "PROFILE", href: "/profile" },
  ];

  const sideNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Challenges", href: "/battle", icon: Swords },
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#111116] text-white flex flex-col font-sans select-none">
      {/* Top Navigation */}
      <header className="h-16 md:h-20 bg-[#16161e] border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-bold italic text-lg lg:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase">
            BATTLE OF BRAINS (BOB)
          </span>
        </div>

        {/* Center Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {topNavItems.map((item) => {
             const isActive = pathname === item.href;
             return (
               <Link 
                 key={item.name} 
                 href={item.href}
                 className={`text-[10px] font-bold uppercase tracking-widest transition-colors py-2 border-b-2 ${isActive ? "text-violet-400 border-violet-500" : "text-zinc-500 border-transparent hover:text-white"}`}
               >
                 {item.name}
               </Link>
             );
          })}
        </nav>

        {/* Right Stats */}
        <div className="flex items-center gap-3">
           {/* XP Badge */}
           <div className="flex items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-full pl-2 pr-4 py-1.5 gap-2 group">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                 <span className="text-[9px] font-bold text-black">XP</span>
              </div>
              <span className="font-semibold text-xs tracking-tight">{user.xp}</span>
           </div>

           {/* Coins Badge */}
           <div className="flex items-center justify-center bg-amber-500/10 border border-amber-500/20 rounded-full pl-2 pr-4 py-1.5 gap-2 group">
              <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                 <span className="text-[9px] font-bold text-black">B</span>
              </div>
              <span className="font-semibold text-xs tracking-tight">{user.coins}</span>
           </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <aside className="hidden md:flex w-64 flex-col bg-[#16161e]/50 border-r border-white/5 p-4">
          <nav className="flex-1 space-y-2 mt-4">
            {sideNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? "bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[inset_0_0_20px_rgba(139,92,246,0.1)]" : "text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent"}`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-auto space-y-2">
             <Link href="/help" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-white/5 hover:text-white transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Help Center</span>
             </Link>
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors">
               <LogOut className="w-5 h-5" />
               <span className="text-sm font-medium">Logout</span>
             </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#16161e]/90 backdrop-blur-xl border-t border-white/5 z-50 px-6 py-4 pb-safe flex justify-between">
          {sideNavItems.map((item) => {
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
    </div>
  );
}
