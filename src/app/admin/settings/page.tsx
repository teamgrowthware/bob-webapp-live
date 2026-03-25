"use client";

import { useState } from "react";
import { 
  Shield, 
  Settings as SettingsIcon, 
  Users, 
  Database, 
  BarChart2, 
  ChevronRight, 
  Lock,
  Zap,
  Server,
  Terminal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("system");

  const tabs = [
    { id: "system", name: "System Intel", icon: Server },
    { id: "users", name: "User Protocol", icon: Users },
    { id: "security", name: "Nexus Firewall", icon: Shield },
    { id: "nexus", name: "Nexus Terminal", icon: Terminal },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/10 border border-rose-500/20 text-[10px] font-black text-rose-500 uppercase tracking-widest">
           <SettingsIcon size={12} /> Root Configuration
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
           Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">Settings</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg">
           Manage global system variables and administrative access levels.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-1 space-y-2">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border ${
                 activeTab === tab.id 
                 ? "bg-rose-600 text-white border-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.2)]" 
                 : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10 hover:text-white"
               }`}
             >
               <div className="flex items-center gap-3">
                 <tab.icon size={18} className={activeTab === tab.id ? "text-white" : "text-zinc-600"} />
                 <span className="text-[11px] font-black uppercase tracking-widest">{tab.name}</span>
               </div>
               {activeTab === tab.id && <ChevronRight size={16} />}
             </button>
           ))}
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3">
           <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
             <CardHeader className="border-b border-white/5 p-8">
                <CardTitle className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
                   {tabs.find(t => t.id === activeTab)?.icon && <div className="p-2 bg-rose-600/20 rounded-lg text-rose-500">
                      {/* @ts-ignore */}
                      {(() => { const Icon = tabs.find(t => t.id === activeTab)?.icon; return Icon ? <Icon size={20} /> : null })()}
                   </div>}
                   {tabs.find(t => t.id === activeTab)?.name}
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8">
                {activeTab === "system" && (
                  <div className="space-y-6">
                     {[
                       { label: "Maintenance Mode", desc: "Shut down all user sessions for emergency maintenance.", icon: <Zap size={16} /> },
                       { label: "Debug Logs", desc: "Enable verbose logging for system diagnostics.", icon: <BarChart2 size={16} /> },
                       { label: "Global Waitlist", desc: "Control registration flow for new recruits.", icon: <Database size={16} /> },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-zinc-950/50 border border-white/5">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-zinc-800 rounded-lg text-rose-400">{item.icon}</div>
                             <div>
                                <h4 className="text-sm font-bold text-white uppercase italic">{item.label}</h4>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight">{item.desc}</p>
                             </div>
                          </div>
                          <div className="w-12 h-6 bg-rose-600 rounded-full relative cursor-pointer group">
                             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all group-active:scale-90" />
                          </div>
                       </div>
                     ))}
                  </div>
                )}

                {activeTab === "users" && (
                   <div className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Default Starting XP</label>
                            <Input className="bg-zinc-950 border-white/5 text-white h-12 rounded-xl" placeholder="500" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Initial Coin Bonus</label>
                            <Input className="bg-zinc-950 border-white/5 text-white h-12 rounded-xl" placeholder="100" />
                         </div>
                      </div>
                      <Button className="bg-rose-600 text-white hover:bg-rose-500 font-black uppercase tracking-widest px-8 h-12 rounded-xl transition-all active:scale-95 shadow-lg shadow-rose-600/20">
                         Save Global Presets
                      </Button>
                   </div>
                )}

                {activeTab === "security" && (
                   <div className="space-y-8 max-w-md">
                      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex gap-4">
                         <Lock className="text-rose-500 mt-1 shrink-0" size={20} />
                         <div>
                            <h4 className="text-sm font-black text-white uppercase italic">Access Level: OMEGA</h4>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight mt-1">You are modifying core system permissions. Proceed with extreme caution.</p>
                         </div>
                      </div>
                      <Button className="w-full bg-zinc-950 border border-white/10 text-white hover:bg-zinc-800 h-14 rounded-xl font-black uppercase tracking-widest text-xs transition-all italic underline">
                         Revoke all active admin tokens
                      </Button>
                   </div>
                )}

                {activeTab === "nexus" && (
                  <div className="space-y-8">
                     <div className="relative p-10 rounded-[32px] bg-zinc-950 border border-rose-600/50 overflow-hidden group">
                        <div className="relative z-10 space-y-4">
                           <div className="w-16 h-16 bg-rose-600/20 rounded-2xl flex items-center justify-center border border-rose-600/30 mb-8">
                              <Terminal size={32} className="text-rose-500" />
                           </div>
                           <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none tracking-widest">NEXUS PROTOCOL<br/>ENHANCED</h2>
                           <p className="text-rose-500 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Waiting for manual override command...</p>
                           <div className="pt-6">
                              <Button className="bg-rose-600 text-white hover:bg-rose-500 font-black uppercase tracking-widest px-10 h-14 rounded-full transition-all active:scale-95 shadow-2xl shadow-rose-600/40">
                                INITIALIZE PURGE
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
