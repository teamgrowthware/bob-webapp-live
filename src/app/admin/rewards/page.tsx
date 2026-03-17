"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Plus, Package, TrendingUp, AlertCircle, Trash2, Edit3, Globe } from "lucide-react";
import Image from "next/image";

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState([
    { id: "1", name: "Razer DeathAdder Essential", cost: 2500, stock: 42, category: "HARDWARE", img: "🖱️" },
    { id: "2", name: "Amazon ₹500 Voucher", cost: 1000, stock: 128, category: "VOUCHER", img: "🎫" },
    { id: "3", name: "SteelSeries Arctis 1", cost: 4500, stock: 15, category: "HARDWARE", img: "🎧" },
    { id: "4", name: "BOB Elite T-Shirt", cost: 1500, stock: 50, category: "MERCH", img: "👕" },
  ]);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Loot Inventory</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Manage physical and digital rewards</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 rounded-2xl h-14 shadow-xl active:scale-95 transition-all">
              <Plus size={20} className="mr-2" /> ADD NEW LOOT
           </Button>
        </div>
      </header>

      {/* Reward Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
               <Package size={32} />
            </div>
            <div>
               <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">In Stock Items</p>
               <h3 className="text-3xl font-black text-white">235</h3>
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
               <TrendingUp size={32} />
            </div>
            <div>
               <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Redeemed Today</p>
               <h3 className="text-3xl font-black text-white">18</h3>
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400">
               <AlertCircle size={32} />
            </div>
            <div>
               <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Out of Stock</p>
               <h3 className="text-3xl font-black text-white">3</h3>
            </div>
         </Card>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
         {rewards.map((r) => (
            <Card key={r.id} className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden group hover:border-violet-500/50 transition-all flex flex-col">
               <div className="h-48 bg-zinc-950 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                  {r.img}
               </div>
               <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{r.category}</span>
                        <h4 className="text-lg font-black text-white uppercase leading-tight mt-1">{r.name}</h4>
                     </div>
                  </div>
                  
                  <div className="mt-auto space-y-4">
                     <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Cost</span>
                           <span className="text-xl font-black text-amber-500">{r.cost.toLocaleString()} <span className="text-[10px] ml-0.5">BC</span></span>
                        </div>
                        <div className="text-right flex flex-col">
                           <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Stock</span>
                           <span className={`text-xl font-black ${r.stock < 20 ? 'text-rose-500' : 'text-white'}`}>{r.stock}</span>
                        </div>
                     </div>

                     <div className="flex gap-2">
                        <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-xl h-12 uppercase text-[10px] tracking-widest">
                           <Edit3 size={14} className="mr-2" /> EDIT
                        </Button>
                        <Button variant="destructive" className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl h-12">
                           <Trash2 size={14} />
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  );
}
