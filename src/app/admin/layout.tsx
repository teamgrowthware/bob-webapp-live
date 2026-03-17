import Link from "next/link";
import { Brain, LayoutDashboard, Users, Library, Gift, Trophy, BarChart3, Settings, LogOut, ShieldCheck, Package, Megaphone, MessageSquare } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white font-sans">
      {/* Sidebar */}
      <aside className="w-68 border-r border-zinc-900 bg-zinc-950 flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl">
            <Brain className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter leading-none">BOB HQ</span>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">System Controller</span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4 overflow-y-auto">
          <Link href="/admin">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white text-black font-black transition-all cursor-pointer shadow-lg shadow-white/5">
              <BarChart3 size={22} />
              Analytics
            </div>
          </Link>
          <Link href="/admin/users">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
              <Users size={22} />
              User Control
            </div>
          </Link>
          <Link href="/admin/quizzes">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
              <Library size={22} />
              Global Quizzes
            </div>
          </Link>
          <Link href="/admin/rewards">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
               <Gift size={22} />
               Loot Store
            </div>
          </Link>
          <Link href="/admin/redemptions">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
               <Package size={22} />
               Loot Queue
            </div>
          </Link>
          <Link href="/admin/leads">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
               <ShieldCheck size={22} />
               Waitlist Leads
            </div>
          </Link>
          <Link href="/admin/ads">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
               <Megaphone size={22} />
               Ad Network
            </div>
          </Link>
          <Link href="/admin/doubts">
            <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
               <MessageSquare size={22} />
               Doubt Portal
            </div>
          </Link>
        </nav>

        <div className="p-6 border-t border-zinc-900">
           <Link href="/login">
             <div className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all cursor-pointer font-black uppercase text-xs tracking-widest">
               <LogOut size={22} />
               Shutdown
             </div>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
        {children}
      </main>
    </div>
  );
}
