"use client";

import { useState } from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  BookOpen, 
  Shield, 
  Sparkles, 
  ChevronRight, 
  Globe,
  Database,
  Lock,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "Educator Profile", icon: User },
    { id: "classroom", name: "Classroom Config", icon: BookOpen },
    { id: "security", name: "Security Gate", icon: Shield },
    { id: "intel", name: "Teacher Intel", icon: Sparkles },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase tracking-widest">
           <SettingsIcon size={12} /> Command Configuration
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
           Teacher <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Settings</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs max-w-lg">
           Manage your classroom protocols and mission forge settings.
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
                 ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                 : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/10 hover:text-white"
               }`}
             >
               <div className="flex items-center gap-3">
                 <tab.icon size={18} className={activeTab === tab.id ? "text-violet-600" : "text-zinc-600"} />
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
                   {tabs.find(t => t.id === activeTab)?.icon && <div className="p-2 bg-violet-600/20 rounded-lg text-violet-400">
                      {/* @ts-ignore */}
                      {(() => { const Icon = tabs.find(t => t.id === activeTab)?.icon; return Icon ? <Icon size={20} /> : null })()}
                   </div>}
                   {tabs.find(t => t.id === activeTab)?.name}
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8">
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Instructor Name</label>
                          <Input className="bg-zinc-950 border-white/5 text-white h-12 rounded-xl focus:ring-violet-500" placeholder="Prof. X" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Official Email</label>
                          <Input className="bg-zinc-950 border-white/5 text-zinc-500 h-12 rounded-xl" disabled value="teacher@bob.com" />
                       </div>
                    </div>
                    <div className="pt-4">
                       <Button className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest px-8 h-12 rounded-xl transition-all active:scale-95">
                          Update Profile
                       </Button>
                    </div>
                  </div>
                )}

                {activeTab === "classroom" && (
                  <div className="space-y-6">
                     {[
                       { label: "Auto-Forge Weekly", desc: "Automatically generate weekly quizzes based on curriculum.", icon: <Layers size={16} /> },
                       { label: "Squad Performance Alerts", desc: "Get notified when student performance drops below threshold.", icon: <Globe size={16} /> },
                       { label: "Public Classroom Mode", desc: "Allow students from other schools to view mission scores.", icon: <Database size={16} /> },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-zinc-950/50 border border-white/5">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">{item.icon}</div>
                             <div>
                                <h4 className="text-sm font-bold text-white uppercase italic">{item.label}</h4>
                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight">{item.desc}</p>
                             </div>
                          </div>
                          <div className="w-12 h-6 bg-violet-600 rounded-full relative cursor-pointer group">
                             <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all group-active:scale-90" />
                          </div>
                       </div>
                     ))}
                  </div>
                )}

                {activeTab === "security" && (
                   <div className="space-y-8 max-w-md">
                      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex gap-4">
                         <Lock className="text-rose-500 mt-1 shrink-0" size={20} />
                         <div>
                            <h4 className="text-sm font-black text-white uppercase italic">Access Protocol Delta</h4>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-tight mt-1">Multi-factor authentication recommended for all instruction staff.</p>
                         </div>
                      </div>
                      <Button className="w-full bg-zinc-950 border border-white/10 text-white hover:bg-zinc-800 h-14 rounded-xl font-black uppercase tracking-widest text-xs transition-all italic">
                         Request Password credentials shift
                      </Button>
                   </div>
                )}

                {activeTab === "intel" && (
                  <div className="space-y-8">
                     <div className="relative p-10 rounded-[32px] bg-gradient-to-br from-violet-600 to-fuchsia-600 overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-[60px] rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
                        <div className="relative z-10 space-y-4">
                           <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 mb-8">
                              <Sparkles size={32} className="text-white animate-pulse" />
                           </div>
                           <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">TEACHER CORE<br/>DASHBOARD PRO</h2>
                           <p className="text-white/80 font-bold uppercase tracking-[0.2em] text-[10px]">Enhanced analytics and AI quiz generation active.</p>
                           <div className="pt-6">
                              <Button className="bg-white text-violet-600 hover:bg-white/90 font-black uppercase tracking-widest px-10 h-14 rounded-full transition-all active:scale-95 shadow-2xl">
                                VIEW ANALYTICS
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
