"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  MessagesSquare, 
  Phone, 
  Mail, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Shield,
  Zap,
  Trophy
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { 
      question: "How do I earn BOB Coins?", 
      answer: "Complete daily mock quizzes and win battles in the Arena. Elite warriors earn 2x coins for every victory.",
      icon: <Trophy size={16} className="text-amber-500" />
    },
    { 
      question: "What is 'Demo Mode'?", 
      answer: "Demo Mode is our fail-safe protocol that allows you to continue training even if the global database is temporarily offline. Your data is synced once connection is restored.",
      icon: <Zap size={16} className="text-violet-500" />
    },
    { 
      question: "How are battle opponents chosen?", 
      answer: "Our AI matchmaking system selects worthy rivals based on your current Class (Tier) and recent victory streaks.",
      icon: <Shield size={16} className="text-blue-500" />
    },
    { 
      question: "Can I use BOB on mobile?", 
      answer: "Yes, the Battle of Brains terminal is fully responsive and optimized for mobile deployment on iOS and Android browsers.",
      icon: <ExternalLink size={16} className="text-emerald-500" />
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative p-12 rounded-[40px] bg-[#16161e] border border-white/5 overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-[10px] font-black text-violet-400 uppercase tracking-widest">
              <HelpCircle size={12} /> Signal Support
           </div>
           <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
              Signal <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">HQ</span>
           </h1>
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Access the central database of protocols and combat troubleshooting.
           </p>
           
           <div className="relative mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <Input 
                className="bg-zinc-950/50 border-white/10 text-white h-14 pl-12 rounded-2xl focus:ring-violet-500 text-sm font-medium" 
                placeholder="Search protocols (e.g., 'matchmaking', 'rewards')" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Support Channels */}
        <div className="lg:col-span-1 space-y-6">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 pl-2">Support Comms</h3>
           
           {[
             { title: "Direct Signal", desc: "Real-time support via encrypted chat.", icon: <MessagesSquare size={20} />, color: "text-blue-500", bg: "bg-blue-500/10" },
             { title: "HQ Comms", desc: "Official support via email dispatch.", icon: <Mail size={20} />, color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" },
             { title: "Dispatch Line", desc: "Urgent voice communication.", icon: <Phone size={20} />, color: "text-amber-500", bg: "bg-amber-500/10" },
           ].map((channel, i) => (
             <button key={i} className="w-full flex items-center gap-4 p-6 rounded-3xl bg-[#16161e] border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all group group">
                <div className={`p-4 rounded-2xl ${channel.bg} ${channel.color} group-hover:scale-110 transition-transform`}>
                   {channel.icon}
                </div>
                <div className="text-left">
                   <h4 className="text-sm font-black text-white uppercase italic">{channel.title}</h4>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{channel.desc}</p>
                </div>
             </button>
           ))}
        </div>

        {/* FAQs */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 pl-2">Combat Protocol (FAQ)</h3>
           
           <Card className="bg-[#16161e] border-white/5 overflow-hidden rounded-[32px]">
             <CardContent className="p-4 sm:p-8 space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className={`rounded-2xl border transition-all ${isOpen ? "bg-zinc-950/50 border-violet-500/20" : "bg-transparent border-white/5 hover:border-white/10"}`}>
                       <button 
                         onClick={() => setOpenFaq(isOpen ? null : index)}
                         className="w-full flex items-center justify-between p-6 text-left"
                       >
                          <div className="flex items-center gap-4">
                             {faq.icon}
                             <span className="text-sm font-bold text-white uppercase italic">{faq.question}</span>
                          </div>
                          {isOpen ? <ChevronUp size={18} className="text-violet-400" /> : <ChevronDown size={18} className="text-zinc-600" />}
                       </button>
                       {isOpen && (
                         <div className="px-6 pb-6 text-xs text-zinc-500 font-medium leading-relaxed uppercase tracking-tight">
                            {faq.answer}
                         </div>
                       )}
                    </div>
                  );
                })}
             </CardContent>
           </Card>

           {/* Contact Section */}
           <div className="p-8 rounded-[32px] bg-gradient-to-r from-violet-600/10 to-transparent border border-violet-500/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <h3 className="text-lg font-black text-white uppercase italic">Can't find the intel?</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Dispatch a direct query to HQ and we'll signal back.</p>
                 </div>
                 <Button className="bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest px-8 rounded-xl h-12 shadow-xl shadow-white/5 active:scale-95 transition-all">
                    SIGNAL HQ
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
