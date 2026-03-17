"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";

export default function AdminRedemptions({ initialRedemptions }: { initialRedemptions: any[] }) {
  const [redemptions, setRedemptions] = useState(initialRedemptions);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [voucherInputs, setVoucherInputs] = useState<Record<string, string>>({});

  const handleUpdate = async (id: string, status: string) => {
    setLoadingId(id);
    const code = voucherInputs[id];

    try {
      const res = await fetch("/api/admin/redemptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ redemptionId: id, status, code }),
      });
      const data = await res.json();

      if (res.ok) {
        setRedemptions(redemptions.map(r => r.id === id ? { ...r, status, code } : r));
      } else {
        alert(data.error);
      }
    } catch {
      alert("Network Error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 col-span-1 md:col-span-2">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6">Reward Redemptions</h3>
        <div className="space-y-4">
          {redemptions.map((r) => (
            <div key={r.id} className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <p className="font-bold text-white mb-1">{r.user.name} <span className="text-zinc-500 font-normal">({r.user.phone})</span></p>
                <p className="text-sm text-amber-400 font-medium">Requested: {r.reward.name} ({r.reward.coinPrice} Coins)</p>
                <p className="text-xs text-zinc-500 mt-1">Class {r.user.class} • {r.user.school}</p>
              </div>

              {r.status === "PENDING" ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Input
                    placeholder="Voucher Code (Optional)"
                    className="bg-zinc-900 border-zinc-700 text-white w-full sm:w-48 h-9"
                    value={voucherInputs[r.id] || ""}
                    onChange={(e) => setVoucherInputs({ ...voucherInputs, [r.id]: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(r.id, "APPROVED")}
                      disabled={loadingId === r.id}
                      className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors flex items-center justify-center flex-1 sm:flex-none"
                    >
                      {loadingId === r.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleUpdate(r.id, "REJECTED")}
                      disabled={loadingId === r.id}
                      className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex items-center justify-center flex-1 sm:flex-none"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${r.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {r.status} {r.code ? `(${r.code})` : ''}
                </div>
              )}
            </div>
          ))}
          {redemptions.length === 0 && <p className="text-zinc-500">No redemption requests yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
