"use client";

import { useEffect, useState } from "react";
import { Trash2, ExternalLink, Mail, Phone, MapPin, School } from "lucide-react";

export default function WaitlistAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    fetch("/api/admin/waitlist")
      .then(res => res.json())
      .then(data => {
        setLeads(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    const res = await fetch("/api/admin/waitlist", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchLeads();
  };

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Engagement Pipeline</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Leads from the frontlines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
             <div className="p-20 text-center font-black italic text-zinc-700 uppercase">Scanning Intelligence...</div>
        ) : leads.map((lead) => (
          <div key={lead.id} className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-[32px] flex flex-col md:flex-row justify-between items-center group hover:border-violet-500/30 transition-all">
             <div className="flex gap-6 items-center flex-1 w-full">
                <div className={`p-4 rounded-2xl ${lead.type === 'SCHOOL' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-violet-500/10 text-violet-500'}`}>
                   {lead.type === 'SCHOOL' ? <School size={24} /> : <Mail size={24} />}
                </div>
                <div>
                   <div className="flex items-center gap-3">
                      <span className="font-black text-xl italic uppercase tracking-tight">{lead.name}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${lead.type === 'SCHOOL' ? 'border-cyan-500/20 text-cyan-500' : 'border-violet-500/20 text-violet-500'}`}>
                        {lead.type}
                      </span>
                   </div>
                   <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase">
                         <Phone size={12} /> {lead.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-500 font-bold text-xs uppercase">
                         <MapPin size={12} /> {lead.city}
                      </div>
                      {lead.class && (
                        <div className="text-zinc-500 font-bold text-xs uppercase">Class {lead.class}</div>
                      )}
                   </div>
                   {lead.message && (
                     <p className="mt-3 text-sm text-zinc-400 font-medium italic border-l-2 border-zinc-800 pl-4">{lead.message}</p>
                   )}
                </div>
             </div>
             
             <div className="flex gap-3 mt-4 md:mt-0">
                <button 
                  onClick={() => deleteLead(lead.id)}
                  className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-700 hover:text-red-500 hover:border-red-500/50 rounded-2xl transition-all"
                >
                   <Trash2 size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
