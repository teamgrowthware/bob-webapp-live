"use client";
import { useState, useEffect } from "react";
import { Loader2, Plus, Image as ImageIcon, Trash } from "lucide-react";

export default function AdminMemesPage() {
  const [memes, setMemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ imageUrl: "", minScore: "0", maxScore: "100", tone: "SAVAGE" });

  useEffect(() => { loadMemes(); }, []);

  const loadMemes = async () => {
    try {
      const res = await fetch("/api/admin/memes");
      if (res.ok) {
        const data = await res.json();
        setMemes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/memes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ imageUrl: "", minScore: "0", maxScore: "100", tone: "SAVAGE" });
    loadMemes();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter">Gamification Vault</h1>
        <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Meme Templates & Savage Feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ADD MEME FORM */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl h-fit">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2"><Plus size={20}/> New Meme Engine</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Image URL</label>
              <input required value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white mt-1" placeholder="https://..." />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Min Score</label>
                <input type="number" required value={form.minScore} onChange={e => setForm({...form, minScore: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white mt-1" />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Max Score</label>
                <input type="number" required value={form.maxScore} onChange={e => setForm({...form, maxScore: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white mt-1" />
              </div>
            </div>
            <div>
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tone</label>
               <select value={form.tone} onChange={e => setForm({...form, tone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white mt-1">
                 <option value="SAVAGE">Savage (Roast)</option>
                 <option value="COMPETITIVE">Competitive</option>
                 <option value="MOTIVATING">Motivating</option>
               </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black p-4 rounded-xl mt-4 flex justify-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "UPLOAD MEME"}
            </button>
          </form>
        </div>

        {/* MEME LIST */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {memes.map(meme => (
            <div key={meme.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group">
              <div className="h-40 bg-zinc-950 flex items-center justify-center p-2">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={meme.imageUrl} alt="Meme" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-black uppercase italic tracking-tighter">{meme.tone}</h3>
                  <p className="text-xs text-zinc-500 font-bold">Bucket: {meme.minScore}% - {meme.maxScore}%</p>
                </div>
              </div>
            </div>
          ))}
          {memes.length === 0 && !loading && (
             <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl">
               <ImageIcon size={48} className="text-zinc-800 mb-4" />
               <p className="text-zinc-500 font-bold uppercase tracking-widest">No memes deployed.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
