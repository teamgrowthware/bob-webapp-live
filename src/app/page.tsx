"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Brain, Trophy, Zap, Shield, ChevronRight, BarChart3, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    startTransition(() => {
      router.push("/login");
    });
  };

  return (
    <div className="min-h-screen bg-[#111116] text-white selection:bg-violet-500/30 overflow-x-hidden font-sans">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 blur-[150px] rounded-full animate-float" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#16161e]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group">
             <span className="font-bold italic text-lg lg:text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase">
                BATTLE OF BRAINS (BOB)
             </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-500">
             <Link href="#features" className="hover:text-white transition-colors">Combat Intel</Link>
             <Link href="#sectors" className="hover:text-white transition-colors">Arena Sectors</Link>
             <Link href="/faq" className="hover:text-white transition-colors">Protocol</Link>
             <Link href="/contact" className="hover:text-white transition-colors">Signal HQ</Link>
          </div>

          <Link href="/login">
            <Button className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-black px-8 rounded-full h-11 transition-all active:scale-95 text-xs uppercase tracking-widest italic">
              Access Terminal
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-violet-600/10 border border-violet-500/20 text-xs font-black text-violet-400 uppercase tracking-widest animate-pulse"
          >
            <Sparkles size={14} /> Global Beta Protocol Active
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold italic uppercase tracking-tighter leading-none text-white"
          >
            Battle of<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 drop-shadow-[0_0_40px_rgba(139,92,246,0.2)]">Brains</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto text-zinc-500 text-sm md:text-base font-semibold leading-relaxed tracking-tight uppercase"
          >
            The elite gamified arena where warriors dominate subjects, crush missions, and secure their place on the global leaderboard.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
             <Button 
                onClick={handleStart} 
                disabled={isPending}
                size="lg" 
                className="h-14 px-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-400 hover:to-emerald-300 text-green-950 font-bold text-lg shadow-[0_0_40px_rgba(34,197,94,0.2)] transition-all hover:scale-105 group active:scale-95 italic uppercase tracking-widest border border-green-300/50"
             >
                ENTER ARENA NOW <ChevronRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
             </Button>
          </motion.div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-20 border-y border-white/5 bg-[#16161e]/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: "Active Warriors", value: "12,450+", icon: <Users className="text-violet-500" /> },
             { label: "Battles Won", value: "854K", icon: <Trophy className="text-[#eab308]" /> },
             { label: "XP Distributed", value: "1.2B", icon: <Zap className="text-blue-500" /> },
             { label: "Success Rate", value: "98.4%", icon: <Shield className="text-emerald-500" /> },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center space-y-3"
             >
                <div className="flex justify-center bg-white/5 w-12 h-12 rounded-2xl items-center mx-auto border border-white/10 mb-6">{stat.icon}</div>
                <p className="text-2xl md:text-3xl font-bold italic tracking-tighter">{stat.value}</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{stat.label}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Arena Features */}
      <section id="features" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-3xl md:text-4xl font-bold italic uppercase tracking-tight mb-4">Technical Advantages</h2>
             <p className="text-zinc-500 font-semibold uppercase text-[9px] tracking-[0.4em]">Optimized for Student Supremacy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Quiz Forge",
                desc: "Dynamic missions tailored to your specific Tier (Class) and weaknesses.",
                icon: <Zap className="text-blue-500 w-8 h-8" />,
                bg: "bg-blue-500/10",
                glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] border-blue-500/20"
              },
              {
                title: "The Vault",
                desc: "Earn BOB Coins for every victory to unlock rare rewards and platform perks.",
                icon: <Trophy className="text-[#eab308] w-8 h-8" />,
                bg: "bg-[#eab308]/10",
                glow: "group-hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] border-[#eab308]/20"
              },
              {
                title: "Global Arena",
                desc: "Compete in real-time battles against students from across the subcontinent.",
                icon: <Shield className="text-rose-500 w-8 h-8" />,
                bg: "bg-rose-500/10",
                glow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] border-rose-500/20"
              }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className={`bg-[#1d1b27] p-10 rounded-[40px] border border-white/5 group cursor-default transition-all duration-500 ${f.glow}`}
              >
                <div className={`w-20 h-20 rounded-3xl ${f.bg} border ${f.glow} flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold italic uppercase tracking-tighter mb-4 text-white group-hover:text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 transition-all">{f.title}</h3>
                <p className="text-zinc-400 font-medium tracking-tight leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 px-6 md:px-12 bg-[#16161e] relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
               <span className="font-black italic text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 uppercase">
                  BATTLE OF BRAINS
               </span>
            </div>
            <p className="text-zinc-500 max-w-sm text-sm font-bold leading-relaxed uppercase tracking-widest">
              The elite educational ecosystem for the high-achieving student of 2026. Join the ranks or get left behind.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Command Sectors</h4>
            <div className="flex flex-col gap-4 text-sm text-zinc-500 font-black italic uppercase tracking-widest">
              <Link href="/dashboard" className="hover:text-violet-400 transition-colors">STUDENT ARENA</Link>
              <Link href="/teacher" className="hover:text-cyan-400 transition-colors">TEACHER CORE</Link>
              <Link href="/admin" className="hover:text-rose-400 transition-colors">ADMIN INTEL</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Support Comms</h4>
            <div className="flex flex-col gap-4 text-sm text-zinc-500 font-black italic uppercase tracking-widest">
               <Link href="/faq" className="hover:text-white transition-colors">PROTOCOL (FAQ)</Link>
               <Link href="/contact" className="hover:text-white transition-colors">SIGNAL HQ (CONTACT)</Link>
               <Link href="/privacy" className="hover:text-white transition-colors">PRIVACY TERMS</Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-zinc-700 font-black uppercase tracking-widest text-[9px]">
            © 2026 BATTLE OF BRAINS ECOSYSTEM • SECURED CONNECTION
          </p>
        </div>
      </footer>
    </div>
  );
}
