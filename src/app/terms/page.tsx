"use client";

import { motion } from "framer-motion";
import { Brain, Gavel } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-violet-500/30 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[0%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 blur-[150px] rounded-full" />
      </div>

      <nav className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter italic">BOB</span>
          </Link>
          <Link href="/login">
            <Button className="bg-white hover:bg-zinc-200 text-black font-black px-6 rounded-full transition-all active:scale-95">
              Enter Arena
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-black text-amber-400 mb-6 uppercase tracking-widest">
            <Gavel size={14} />
            Rules of Engagement
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-tight">
            Terms of<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Battle (TOB)</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-tighter text-sm">Deployment Order: March 20, 2026</p>
        </motion.div>

        <section className="space-y-12 text-zinc-400 font-medium leading-relaxed">
           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white italic uppercase lg:text-3xl">01. Acceptance of Protocol</h2>
              <p>By accessing the Battle of Brains (BOB) Arena, you agree to be bound by these Terms of Battle. If you do not accept these rules, you are prohibited from engaging in any missions or redemptions.</p>
           </div>
           
           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white italic uppercase lg:text-3xl">02. Integrity Code</h2>
              <p>Cheating is strictly forbidden. Any use of external scripts, bots, or unauthorized AI to gain an unfair advantage in battles will result in an immediate and permanent BAN from the Arena. All XP and BOB Coins will be forfeited.</p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white italic uppercase lg:text-3xl">03. Eligibility & Tiers</h2>
              <p>The platform is designed for students in Classes 6-12. Providing false information about your class tier or school in order to compete in lower-level brackets is a violation of the Protocol.</p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white italic uppercase lg:text-3xl">04. Reward Extraction</h2>
              <p>BOB Coins have no monetary value outside the platform. Redemptions are subject to stock availability and verification. Major prizes (Tablets, Gear) may require physical verification of student ID.</p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white italic uppercase lg:text-3xl">05. Arena Conduct</h2>
              <p>Respect your fellow warriors. Harassment, hate speech, or toxic behavior in comments or squad chats will lead to communication blackouts or expulsion.</p>
           </div>

           <div className="space-y-4">
              <h2 className="text-2xl font-black text-white italic uppercase lg:text-3xl">06. Operational Changes</h2>
              <p>The system leads reserve the right to modify battle rules, coin earn rates, or reward prices without prior notice to maintain the stability and balance of the Arena ecosystem.</p>
           </div>
        </section>

        <div className="mt-24 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 text-center">
           <p className="text-zinc-600 font-bold text-sm uppercase tracking-widest">Violating the Protocol results in immediate court-martial.</p>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-zinc-950 text-center">
        <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">© 2026 Battle of Brains • Built for the Elite</p>
      </footer>
    </div>
  );
}
