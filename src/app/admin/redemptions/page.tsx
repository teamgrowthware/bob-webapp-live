"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Gift, Package, Truck, CheckCircle2, XCircle, Search, Filter, MoreVertical, ExternalLink, Loader2 } from "lucide-react";

export default function AdminRedemptionsPage() {
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [voucherInputs, setVoucherInputs] = useState<Record<string, string>>({});

  const fetchRedemptions = async () => {
    try {
      const res = await fetch("/api/admin/redemptions");
      if (res.ok) {
        const data = await res.json();
        setRedemptions(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const code = voucherInputs[id];
    
    try {
      const res = await fetch(`/api/admin/redemptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, code }),
      });
      if (res.ok) {
        await fetchRedemptions();
      }
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "APPROVED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "SHIPPED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "REJECTED": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-zinc-800 text-zinc-500 border-zinc-700";
    }
  };

  const stats = {
    pending: redemptions.filter(r => r.status === "PENDING").length,
    approved: redemptions.filter(r => r.status === "APPROVED").length,
    shipped: redemptions.filter(r => r.status === "SHIPPED").length,
    rejected: redemptions.filter(r => r.status === "REJECTED").length,
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Loot Fulfillment</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Approve and deploy earned rewards</p>
        </div>
      </header>

      {/* Fulfillment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Pending", value: stats.pending, icon: <Package size={20} />, color: "text-amber-500" },
           { label: "Approved", value: stats.approved, icon: <CheckCircle2 size={20} />, color: "text-blue-500" },
           { label: "Shipped", value: stats.shipped, icon: <Truck size={20} />, color: "text-emerald-500" },
           { label: "Rejected", value: stats.rejected, icon: <XCircle size={20} />, color: "text-rose-500" },
         ].map((stat, i) => (
           <Card key={i} className="bg-zinc-900 border-zinc-800 rounded-3xl p-6">
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">{stat.label}</p>
                    <h3 className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</h3>
                 </div>
                 <div className={`p-3 bg-zinc-950 rounded-xl border border-zinc-800 ${stat.color}`}>
                    {stat.icon}
                 </div>
              </div>
           </Card>
         ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <Input placeholder="Search by student or gift..." className="bg-zinc-950 border-zinc-800 text-white pl-12 h-12 rounded-xl font-bold" />
           </div>
        </div>

        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-zinc-700 w-10 h-10" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-950/50">
              <TableRow className="border-zinc-800 h-16">
                <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] px-10">Loot Identity</TableHead>
                <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Claimed By</TableHead>
                <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] text-right px-10">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redemptions.map((r) => (
                <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors h-24">
                  <TableCell className="px-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 shadow-inner">
                           <Gift className="text-violet-400" size={24} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white text-base leading-tight uppercase">{r.reward?.name}</span>
                          <span className="text-[10px] text-zinc-600 font-bold tracking-tight">ID: {r.id.split('-')[0].toUpperCase()}</span>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-black text-zinc-300">{r.user?.name}</span>
                      <span className="text-xs text-zinc-600">{r.user?.school}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.1em] border ${getStatusColor(r.status)}`}>
                        {r.status}
                     </span>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex items-center justify-end gap-2">
                      {r.status === "PENDING" && (
                        <>
                          <Input 
                            placeholder="Voucher Code (Opt)" 
                            className="bg-zinc-950 border-zinc-800 text-white w-32 h-8 text-[10px] font-bold uppercase tracking-widest placeholder:text-zinc-600 focus-visible:ring-violet-500"
                            value={voucherInputs[r.id] || ""}
                            onChange={(e) => setVoucherInputs({...voucherInputs, [r.id]: e.target.value})}
                          />
                          <Button  
                            variant="outline" 
                            size="sm" 
                            className="bg-zinc-950 border-zinc-800 text-emerald-500 hover:bg-emerald-500/10 rounded-xl font-black text-[10px]"
                            onClick={() => updateStatus(r.id, "APPROVED")}
                            disabled={updatingId === r.id}
                          >
                            APPROVE
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-zinc-950 border-zinc-800 text-rose-500 hover:bg-rose-500/10 rounded-xl font-black text-[10px]"
                            onClick={() => updateStatus(r.id, "REJECTED")}
                            disabled={updatingId === r.id}
                          >
                            REJECT
                          </Button>
                        </>
                      )}
                      {r.status === "APPROVED" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-zinc-950 border-zinc-800 text-blue-500 hover:bg-blue-500/10 rounded-xl font-black text-[10px]"
                          onClick={() => updateStatus(r.id, "SHIPPED")}
                          disabled={updatingId === r.id}
                        >
                          MARK SHIPPED
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
      
      <div className="pb-20" />
    </div>
  );
}
