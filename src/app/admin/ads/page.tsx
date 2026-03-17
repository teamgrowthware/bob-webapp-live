"use client";

import { useState, useEffect } from "react";
import { Megaphone, Plus, Trash2, Globe, Layout, CheckCircle, XCircle } from "lucide-react";

export default function AdManagementPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAd, setNewAd] = useState({ title: "", imageUrl: "", linkUrl: "", location: "DASHBOARD" });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    const res = await fetch("/api/admin/ads");
    if (res.ok) setBanners(await res.json());
    setLoading(false);
  };

  const createAd = async () => {
    const res = await fetch("/api/admin/ads", {
      method: "POST",
      body: JSON.stringify(newAd),
    });
    if (res.ok) {
      setShowAddModal(false);
      setNewAd({ title: "", imageUrl: "", linkUrl: "", location: "DASHBOARD" });
      fetchBanners();
    }
  };

  return (
    <div className="p-10 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white italic">AD NETWORK</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs mt-2 ml-1">Monetization & Traffic Control</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-black uppercase italic hover:bg-zinc-200 transition-all"
        >
          <Plus size={20} />
          Deploy New Banner
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((ad) => (
          <div key={ad.id} className="bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden group">
            <div className="aspect-[16/9] bg-zinc-800 relative">
               <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                 <span className="text-[8px] font-black text-white uppercase tracking-widest">{ad.location}</span>
               </div>
            </div>
            <div className="p-6">
               <h3 className="text-white font-black text-xl italic uppercase tracking-tight mb-2">{ad.title}</h3>
               <p className="text-zinc-500 text-[10px] font-bold uppercase truncate mb-4">{ad.linkUrl}</p>
               <div className="flex justify-between items-center">
                  <div className={`flex items-center gap-2 ${ad.isActive ? "text-emerald-500" : "text-zinc-600"}`}>
                    {ad.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {ad.isActive ? "Active Now" : "Paused"}
                    </span>
                  </div>
                  <button className="text-zinc-600 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[40px] p-10">
            <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-8">New Campaign</h2>
            <div className="space-y-6">
              <div>
                <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 block">Campaign Title</label>
                <input 
                  value={newAd.title}
                  onChange={e => setNewAd({...newAd, title: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 h-16 text-white text-lg font-bold outline-none focus:border-white transition-all"
                  placeholder="e.g. Summer Coaching Sale"
                />
              </div>
              <div>
                <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 block">Image URL</label>
                <input 
                  value={newAd.imageUrl}
                  onChange={e => setNewAd({...newAd, imageUrl: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 h-16 text-white text-lg font-bold outline-none focus:border-white transition-all"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 block">Destination URL</label>
                <input 
                  value={newAd.linkUrl}
                  onChange={e => setNewAd({...newAd, linkUrl: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 h-16 text-white text-lg font-bold outline-none focus:border-white transition-all"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-zinc-500 font-black text-[10px] uppercase tracking-widest mb-3 block">Placement</label>
                <select 
                  value={newAd.location}
                  onChange={e => setNewAd({...newAd, location: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 h-16 text-white text-lg font-bold outline-none focus:border-white transition-all"
                >
                  <option value="DASHBOARD">Dashboard Banner</option>
                  <option value="QUIZ_RESULT">Quiz Result Interstitial</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-zinc-800 h-16 rounded-2xl font-black uppercase italic text-white">Cancel</button>
                <button onClick={createAd} className="flex-1 bg-white h-16 rounded-2xl font-black uppercase italic text-black">Deploy</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
