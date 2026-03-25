"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X, User, School, MapPin, Calendar, GraduationCap } from "lucide-react";

export default function ProfileEditClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update profile protocol");
      
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#16161e] border-white/5 shadow-2xl rounded-[32px] overflow-hidden">
      <CardContent className="p-8 md:p-12">
        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest leading-relaxed">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                 <User size={12} className="text-violet-400" /> Full Callsign
              </label>
              <Input name="name" required value={formData.name} onChange={handleChange} className="bg-zinc-950 border-white/5 text-white h-14 rounded-2xl focus:ring-violet-500 text-sm font-medium" placeholder="Elite Warrior" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                 <GraduationCap size={12} className="text-violet-400" /> Current Tier (Class)
              </label>
              <select 
                name="class" 
                required 
                value={formData.class} 
                onChange={handleChange} 
                className="w-full bg-zinc-950 border border-white/5 text-white h-14 rounded-2xl px-6 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none text-sm font-medium"
              >
                {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                 <School size={12} className="text-violet-400" /> Academy (School)
              </label>
              <Input name="school" required value={formData.school} onChange={handleChange} className="bg-zinc-950 border-white/5 text-white h-14 rounded-2xl focus:ring-violet-500 text-sm font-medium" placeholder="Savage High" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                 <Calendar size={12} className="text-violet-400" /> Birth Rotation (DOB)
              </label>
              <Input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="bg-zinc-950 border-white/5 text-white h-14 rounded-2xl focus:ring-violet-500 [color-scheme:dark] text-sm font-medium" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                 <MapPin size={12} className="text-violet-400" /> Sector City
              </label>
              <Input name="city" required value={formData.city} onChange={handleChange} className="bg-zinc-950 border-white/5 text-white h-14 rounded-2xl focus:ring-violet-500 text-sm font-medium" placeholder="City" />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                 <MapPin size={12} className="text-violet-400" /> Sector State
              </label>
              <Input name="state" required value={formData.state} onChange={handleChange} className="bg-zinc-950 border-white/5 text-white h-14 rounded-2xl focus:ring-violet-500 text-sm font-medium" placeholder="State" />
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row gap-4">
            <Button type="submit" disabled={loading} className="flex-1 h-16 bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest rounded-2xl text-lg italic shadow-xl shadow-white/5 active:scale-95 transition-all">
              {loading ? "COMMITTING..." : <span className="flex items-center gap-3"><Save size={20} /> SAVE DEPLOYMENT</span>}
            </Button>
            <Button type="button" onClick={() => router.back()} disabled={loading} className="h-16 bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 font-black uppercase tracking-widest rounded-2xl px-10 italic active:scale-95 transition-all group">
               <X size={20} className="group-hover:rotate-90 transition-transform" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
