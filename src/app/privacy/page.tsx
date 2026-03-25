"use client";

import { motion } from "framer-motion";
import { Brain, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-violet-500/30 overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] bg-violet-600/5 blur-[150px] rounded-full" />
      </div>

      <nav className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight italic">BOB</span>
          </Link>
          <Link href="/login">
            <Button className="bg-white hover:bg-zinc-200 text-black font-bold px-6 rounded-full transition-all active:scale-95">
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 mb-6 uppercase tracking-widest">
            <ShieldCheck size={14} />
            Data Shield Active
          </div>
          <h1 className="text-3xl md:text-5xl font-bold italic uppercase tracking-tight mb-6 leading-tight">
            Privacy<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">Tactical Policy</span>
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-tight text-sm">Last Protocol Update: March 20, 2026</p>
        </motion.div>

        <section className="space-y-12 text-zinc-400 font-medium leading-relaxed">
           <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white italic uppercase lg:text-2xl">
01. Intel Collection</h2>
              <p>We only collect the essential intel needed to facilitate your missions. This includes your name, school, class tier, and a valid comms link (phone number). We DO NOT sell your data to third-party enemy factions.</p>
           </div>
           
           <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white italic uppercase lg:text-2xl">
02. Mission Tracking</h2>
              <p>To keep the leaderboard fair and the rewards accurate, we track your battle performance, accuracy, and time spent in the arena. This data is used to calculate XP and BOB Coin rewards.</p>
           </div>

           <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white italic uppercase lg:text-2xl">
03. Comms & De-briefing</h2>
              <p>We may send you tactical updates via SMS or WhatsApp regarding new missions, reward redemptions, or critical system alerts. You can opt-out of these at any time by contacting support.</p>
           </div>

           <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white italic uppercase lg:text-2xl">
04. Safeguard Protocol</h2>
              <p>Your data is encrypted using high-grade protocols. We take the security of our warriors seriously and constantly monitor for unauthorized incursions into the database.</p>
           </div>

           <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white italic uppercase lg:text-2xl">
05. Extraction Rights</h2>
              <p>You have the right to request a full report of your data or a permanent account deletion (extraction) at any time. Simply signal our support squad.</p>
           </div>
        </section>

        <div className="mt-24 p-8 rounded-3xl bg-zinc-900/50 border border-white/5 text-center">
           <p className="text-zinc-600 font-bold text-sm uppercase tracking-widest">By remaining in the Arena, you agree to these protocols.</p>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-zinc-950 text-center">
        <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">© 2026 Battle of Brains • Built for the Elite</p>
      </footer>
    </div>
  );
}
