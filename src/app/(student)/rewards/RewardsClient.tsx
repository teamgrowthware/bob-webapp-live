"use client";

import { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Gift, Coins, Tag, Lock, Sparkles, Loader2, CheckCircle2, Package, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import GlowCard from "@/components/GlowCard";
import { Button } from "@/components/ui/button";

export default function RewardsClient({ initialRewards, user, initialRedemptions }: { initialRewards: any[], user: any, initialRedemptions: any[] }) {
  const router = useRouter();
  const [rewards, setRewards] = useState(initialRewards);
  const [redemptions, setRedemptions] = useState(initialRedemptions);
  const [balance, setBalance] = useState(user.coins);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const handleRedeem = async (reward: any) => {
    if (balance < reward.coinPrice) return;
    setLoadingId(reward.id);
    setMsg("");

    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, rewardId: reward.id }),
      });
      const data = await res.json();

      if (res.ok) {
        setBalance((prev: number) => prev - reward.coinPrice);
        setMsg(`Bounty Claimed! ${reward.name} is now pending extraction.`);
        setRedemptions([data.redemption, ...redemptions]);
        router.refresh();
      } else {
        setMsg(`Extraction failed: ${data.error}`);
      }
    } catch (e) {
      setMsg("Network jammed. Try again.");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "APPROVED": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "SHIPPED": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "REJECTED": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 bg-zinc-950">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-600/5 blur-[120px] rounded-full animate-pulse-glow" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/5 blur-[120px] rounded-full animate-float" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-zinc-950 border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-5 bg-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.3)] text-black rounded-[28px] animate-bounce-slow">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Rewards Vault</h1>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-3 flex items-center gap-2">
                <Sparkles size={12} className="text-amber-500" />
                Exchange your hard-earned BOB Coins for epic loot.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-zinc-900/50 px-8 py-5 rounded-[28px] border border-white/10 shadow-inner w-full md:w-auto relative z-10">
          <div className="p-2 bg-amber-500/20 rounded-full">
            <Coins className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Available Bounty</span>
            <span className="text-4xl font-black text-white leading-none italic tabular-nums">{balance.toLocaleString()} BC</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {msg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 rounded-3xl flex items-center gap-4 font-black uppercase italic tracking-tighter shadow-[0_0_30px_rgba(16,185,129,0.1)]"
          >
            <div className="p-2 bg-emerald-500 rounded-lg text-zinc-950">
                <CheckCircle2 size={20} />
            </div>
            {msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monthly Big Prize showcase */}
      <div className="relative overflow-hidden rounded-[40px] p-1 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 animate-gradient-x" />
        <div className="relative z-10 bg-zinc-950/90 backdrop-blur-xl rounded-[38px] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-amber-400 font-black tracking-[0.4em] uppercase text-[10px]">ULTIMATE MONTHLY BOUNTY</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">Apple iPad Air</h2>
            <p className="text-zinc-400 max-w-lg font-bold uppercase tracking-tighter text-sm">
                Dominate the National Leaderboards. The Top 10 warriors enter the draw automatically. Extracted monthly.
            </p>
          </div>
          <div className="px-10 py-6 bg-white shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-[32px] text-zinc-950 font-black text-3xl italic uppercase tracking-tighter transform -rotate-3">
            Ends In 14d
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {rewards.length === 0 && <p className="text-zinc-600 font-black uppercase tracking-widest text-xs text-center p-20 border-2 border-dashed border-white/5 rounded-[40px] w-full col-span-2">The vault is currently empty.</p>}
        {rewards.map((reward, idx) => {
          const canAfford = balance >= reward.coinPrice && reward.stock > 0;
          const isOut = reward.stock <= 0;
          return (
            <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
                <GlowCard key={reward.id} glowColor={canAfford ? "amber" : "violet"} animate={false} className={`${isOut ? 'opacity-40 grayscale' : ''}`}>
                  <CardContent className="p-10 relative group h-full flex flex-col">
                    <div className="flex justify-between items-start mb-12">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950 border border-white/10 text-[9px] font-black text-zinc-400 uppercase tracking-widest shrink-0">
                        <Tag className="w-3 h-3 text-amber-500" />
                        {reward.type}
                      </div>
                      {!canAfford && !isOut && (
                        <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
                          <Lock className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 uppercase italic tracking-tighter leading-tight line-clamp-2">{reward.name}</h3>
                    <p className="text-zinc-500 font-bold text-xs mb-10 line-clamp-3 uppercase tracking-tighter flex-1">{reward.description}</p>

                    <div className="flex items-center justify-between pt-8 border-t border-white/5 border-dashed mt-auto">
                      <div>
                        <div className="flex items-center gap-3">
                          <Coins className="w-6 h-6 text-amber-500" />
                          <span className={`font-black text-3xl italic tracking-tighter tabular-nums ${canAfford ? 'text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'text-zinc-600'}`}>
                            {reward.coinPrice.toLocaleString()} BC
                          </span>
                        </div>
                        <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-2 block">Available Stock: {reward.stock}</span>
                      </div>

                      <Button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford || loadingId === reward.id}
                        size="lg"
                        className={`h-16 px-10 rounded-2xl font-black text-lg italic transition-all uppercase tracking-tighter shadow-2xl ${canAfford
                          ? "bg-amber-500 text-black hover:bg-white hover:scale-105 active:scale-95 border-b-4 border-amber-700"
                          : "bg-zinc-950 text-zinc-600 border border-white/5 cursor-not-allowed"
                          }`}
                      >
                        {loadingId === reward.id ? <Loader2 className="w-6 h-6 animate-spin" /> : (isOut ? "Depleted" : "Claim Loot")}
                      </Button>
                    </div>
                  </CardContent>
                </GlowCard>
            </motion.div>
          );
        })}
      </div>

      {/* Redemption History */}
      {redemptions.length > 0 && (
        <div className="space-y-8 pt-12">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Bounty Extraction Log</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <div className="grid gap-4">
            {redemptions.map((red) => (
              <motion.div 
                key={red.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zinc-950/40 border border-white/5 p-6 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md group hover:bg-zinc-900/50 transition-all"
              >
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-16 h-16 bg-zinc-950 rounded-[20px] flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                    <Package className="text-zinc-500 group-hover:text-amber-500 transition-colors" size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter line-clamp-1">{red.reward?.name}</h4>
                    <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-1">
                      Extraction initiated on {new Date(red.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                   <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] border shadow-sm ${getStatusColor(red.status)}`}>
                     {red.status}
                   </span>
                   {red.code && (
                     <span className="text-cyan-400 font-mono text-sm font-black bg-cyan-400/10 px-4 py-1.5 rounded-xl border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                       EXTRACT_ID: {red.code}
                     </span>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
