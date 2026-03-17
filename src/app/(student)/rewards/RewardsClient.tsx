"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Coins, Tag, Lock, Sparkles, Loader2, CheckCircle2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

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
        setMsg(`Success! You redeemed ${reward.name}. It is now pending admin approval.`);
        setRedemptions([data.redemption, ...redemptions]);
        router.refresh();
      } else {
        setMsg(`Redemption failed: ${data.error}`);
      }
    } catch (e) {
      setMsg("Network error.");
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Gift className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Rewards Vault</h1>
            <p className="text-zinc-400 mt-1">Exchange your hard-earned BOB Coins for epic loot.</p>
          </div>
        </div>
        <div className="flex items-end gap-3 bg-zinc-950 px-6 py-4 rounded-2xl border border-zinc-800/50 shadow-inner w-full md:w-auto">
          <Coins className="w-8 h-8 text-amber-500 mb-1" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your Balance</span>
            <span className="text-4xl font-black text-white leading-none">{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-5 h-5" /> {msg}
        </div>
      )}

      {/* Monthly Big Prize showcase */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="text-amber-300 font-black tracking-widest uppercase text-xs">Monthly Big Bounty</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Apple iPad Air</h2>
            <p className="text-violet-200 max-w-sm font-medium">Be in the Top 10 National Rank by the end of the month to automatically enter the draw.</p>
          </div>
          <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white font-bold text-lg">
            Locks in 14 Days
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
        {rewards.length === 0 && <p className="text-zinc-500 font-medium">No rewards available in the vault yet.</p>}
        {rewards.map(reward => {
          const canAfford = balance >= reward.coinPrice && reward.stock > 0;
          const isOut = reward.stock <= 0;
          return (
            <Card key={reward.id} className={`bg-zinc-900 border-zinc-800 overflow-hidden relative group ${isOut ? 'opacity-50' : ''}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-600 opacity-5 blur-3xl" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-12">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-xs font-bold text-zinc-300">
                    <Tag className="w-3 h-3" />
                    {reward.type}
                  </div>
                  {!canAfford && !isOut && (
                    <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{reward.name}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{reward.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-amber-500" />
                      <span className={`font-black text-xl ${canAfford ? 'text-amber-500' : 'text-zinc-500'}`}>
                        {reward.coinPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-zinc-500 text-xs font-bold uppercase mt-1 block">Stock: {reward.stock}</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || loadingId === reward.id}
                    className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${canAfford
                      ? "bg-white text-zinc-950 hover:bg-zinc-200"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                  >
                    {loadingId === reward.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing</> : (isOut ? "Out of Stock" : "Redeem")}
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Redemption History */}
      {redemptions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">My Bounty Log</h2>
            <div className="h-px flex-1 bg-zinc-900" />
          </div>
          <div className="grid gap-3">
            {redemptions.map((red) => (
              <div key={red.id} className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shadow-inner">
                    <Package className="text-zinc-500" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase text-sm italic">{red.reward?.name}</h4>
                    <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-1">
                      Claimed on {new Date(red.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${getStatusColor(red.status)}`}>
                     {red.status}
                   </span>
                   {red.code && (
                     <span className="text-cyan-400 font-mono text-xs font-bold bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                       CODE: {red.code}
                     </span>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
