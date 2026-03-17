"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Flame, Trophy, Users, Zap, School, ArrowRight, CheckCircle2, MessageSquare, ShieldCheck, Gamepad2, Stars, Swords } from "lucide-react";
import Link from "next/link";
import { submitWaitlist } from "./actions";

export default function LandingPage() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleWaitlistSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await submitWaitlist(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Something went wrong. Try again.");
      }
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-violet-500/30 overflow-x-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-2 rounded-xl shadow-lg shadow-violet-500/20">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">BOB</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#how-it-works" className="hidden md:block text-zinc-400 hover:text-white font-medium transition-colors">How it Works</Link>
            <Link href="#waitlist">
              <Button className="bg-white hover:bg-zinc-200 text-black font-black px-6 rounded-full transition-all active:scale-95">
                Join Arena
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* HERO SECTION */}
        <section className="relative pt-24 pb-32 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-bold text-violet-400 mb-8 animate-bounce-slow">
              <Stars className="w-4 h-4" />
              <span>Launching in Select Schools Soon</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] text-white">
              STOP STUDYING.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                START BATTLING.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
              Battle of Brains (BOB) turns your boring subjects into heart-pounding 1v1 battles. Climb the national leaderboard and win rewards that actually matter.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="#waitlist" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-violet-600 hover:bg-violet-500 text-white font-black h-16 px-10 text-xl rounded-2xl shadow-2xl shadow-violet-600/40 transition-all active:scale-95 group">
                  Claim Your Handle <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex items-center gap-[-10px]">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center -ml-3 first:ml-0 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
                  </div>
                ))}
                <span className="ml-4 text-zinc-500 font-bold text-sm tracking-wide">Join 400+ Smart Minds</span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS - MVP SCALE */}
        <section id="how-it-works" className="py-32 bg-zinc-900/40 border-y border-zinc-900 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black mb-6">THE STUDENT<br /><span className="text-violet-500">LIFECYCLE</span></h2>
                <p className="text-zinc-400 text-lg font-medium">We replaced boring MCQ tests with aggressive gamification. Here is how you dominate.</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700 flex items-center gap-4">
                <Zap className="text-amber-400" />
                <span className="text-white font-bold">New Battles Every 24h</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", icon: <Gamepad2 className="text-violet-400" />, title: "Join the Arena", desc: "Select your school and class. Get your daily battle packet based on your actual syllabus." },
                { step: "02", icon: <Swords className="text-fuchsia-400" />, title: "Battle 1v1", desc: "Clash with students across India in real-time. Speed + Accuracy = Massive XP." },
                { step: "03", icon: <Trophy className="text-cyan-400" />, title: "Redeem Loot", desc: "Bored of digital badges? Win real tech, vouchers, and school bragging rights." },
              ].map((item, i) => (
                <div key={i} className="relative p-10 rounded-3xl bg-zinc-950 border border-zinc-900 group hover:border-violet-500/50 transition-all duration-500">
                  <span className="absolute top-6 right-10 text-6xl font-black text-zinc-900 group-hover:text-violet-500/10 transition-colors uppercase">{item.step}</span>
                  <div className="mb-8 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 inline-block group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white uppercase">{item.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WAITLIST SECTION */}
        <section id="waitlist" className="py-32 px-4">
          <div className="max-w-5xl mx-auto">
             <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="text-5xl font-black mb-8 leading-tight">LIMITED ACCESS.<br /><span className="text-fuchsia-500">SECURE YOUR HANDLE.</span></h2>
                   <div className="space-y-6">
                      {[ 
                        { icon: <CheckCircle2 className="text-green-500" />, text: "Early Bird Badges for first 1,000 signups" },
                        { icon: <CheckCircle2 className="text-green-500" />, text: "Exclusive access to Beta Battles" },
                        { icon: <CheckCircle2 className="text-green-500" />, text: "Surprise onboarding BOB coins" }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                           {item.icon}
                           <span className="text-zinc-300 font-bold text-lg">{item.text}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-zinc-900 p-8 md:p-12 rounded-[40px] border border-zinc-800 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/10 blur-3xl rounded-full" />
                   
                   {submitted ? (
                     <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                           <CheckCircle2 color="#22c55e" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">YOU'RE IN THE ARENA!</h3>
                        <p className="text-zinc-500 font-medium">Keep an eye on your phone. We'll text you when your rank is ready.</p>
                     </div>
                   ) : (
                     <form action={handleWaitlistSubmit} className="space-y-5">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Player Identity</label>
                           <input name="name" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold placeholder:text-zinc-700" placeholder="Display Name (e.g. BrainLord)" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Current Tier</label>
                              <select name="class" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold appearance-none">
                                {[6,7,8,9,10,11,12].map(c => <option key={c} value={c}>Class {c}</option>)}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Zone</label>
                              <input name="city" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold placeholder:text-zinc-700" placeholder="City" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Comms Link</label>
                           <input name="phone" required type="tel" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-bold placeholder:text-zinc-700" placeholder="WhatsApp Number" />
                        </div>
                        {error && <p className="text-red-500 text-sm font-bold ml-1">{error}</p>}
                        <Button disabled={isPending} type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-[1.02] text-white mt-4 rounded-2xl py-8 font-black text-xl shadow-xl shadow-fuchsia-600/20 active:scale-95 transition-all">
                           {isPending ? "Connecting..." : "JOIN THE WAITLIST"}
                        </Button>
                     </form>
                   )}
                </div>
             </div>
          </div>
        </section>

        {/* SCHOOL PARTNERSHIP SECTION */}
        <section className="py-24 bg-zinc-900/20 border-t border-zinc-900 px-4">
          <div className="max-w-4xl mx-auto rounded-[50px] bg-gradient-to-br from-violet-600 to-fuchsia-700 p-12 md:p-20 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-black/20" />
             <div className="relative z-10">
                <School className="w-16 h-16 text-white/50 mx-auto mb-8" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">Are you a Teacher?</h2>
                <p className="text-white/80 text-xl font-bold mb-10 max-w-2xl mx-auto">Bring BOB to your school. Automate testing, track national benchmarking, and increase student engagement by 400%.</p>
                <Link href="#waitlist">
                  <Button variant="secondary" className="bg-white text-violet-600 hover:bg-zinc-100 font-black h-16 px-10 text-xl rounded-2xl transition-all active:scale-95 shadow-2xl">
                    Get School Access
                  </Button>
                </Link>
             </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 py-16 px-4 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
           <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-violet-500" />
                <span className="font-black text-xl tracking-tight text-white">BOB</span>
              </div>
              <p className="text-zinc-500 font-medium max-w-sm">The ultimate Gen-Z learning arena. We are building the future of classroom competition.</p>
           </div>
           <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Legal</h4>
              <div className="flex flex-col gap-4 text-zinc-500 font-bold">
                 <Link href="#" className="hover:text-white">Privacy Policy</Link>
                 <Link href="#" className="hover:text-white">Terms of Battle</Link>
              </div>
           </div>
           <div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Connect</h4>
              <div className="flex flex-col gap-4 text-zinc-500 font-bold">
                 <Link href="#" className="hover:text-white">Instagram</Link>
                 <Link href="#" className="hover:text-white">Twitter / X</Link>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 text-center">
            <p className="text-zinc-600 font-bold text-sm">© 2026 Battle of Brains. Built for the Elite.</p>
        </div>
      </footer>
    </div>
  );
}
