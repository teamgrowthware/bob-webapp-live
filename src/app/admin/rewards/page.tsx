"use client";

import { useEffect, useState } from "react";
import { Gift, Package, CheckCircle, XCircle, ShoppingBag } from "lucide-react";

export default function RewardsAdmin() {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/rewards")
      .then(res => res.json())
      .then(data => {
        setRewards(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Loot Distribution</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Manage Reward stock & redemption requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/30 border border-zinc-900 rounded-[40px] p-8">
           <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
              <Package size={20} className="text-violet-500" /> Catalog Inventory
           </h2>
           <div className="space-y-4">
              {loading ? (
                <div className="p-10 text-center font-black italic text-zinc-700 uppercase">Counting Loot...</div>
              ) : rewards.map(r => (
                <div key={r.id} className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl flex justify-between items-center group hover:border-violet-500/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                         <Gift size={20} className="text-zinc-600 group-hover:text-violet-400" />
                      </div>
                      <div>
                         <div className="font-black text-white italic uppercase tracking-tight">{r.name}</div>
                         <div className="text-[10px] font-bold text-zinc-500 uppercase">{r.category} • {r.price} Coins</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xl font-black italic tracking-tighter">{r.stock}</div>
                      <div className="text-[10px] font-black text-zinc-600 uppercase">Left in stock</div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-zinc-900/40 border border-violet-500/20 rounded-[40px] p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-3xl rounded-full" />
           <h2 className="text-xl font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
              <ShoppingBag size={20} className="text-fuchsia-500" /> Pending Approvals
           </h2>
           <div className="flex flex-col items-center justify-center py-20 text-center">
              <CheckCircle size={48} className="text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">All clear!</p>
              <p className="text-zinc-600 text-sm mt-2 font-medium">No pending redemption requests at this moment.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
