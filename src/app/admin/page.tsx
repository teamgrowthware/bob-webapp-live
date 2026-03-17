import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Zap, Users, Trophy, Gift, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

const data = [
  { name: "Mon", users: 400, quizzes: 240, coins: 2100 },
  { name: "Tue", users: 300, quizzes: 139, coins: 1800 },
  { name: "Wed", users: 200, quizzes: 980, coins: 2900 },
  { name: "Thu", users: 278, quizzes: 390, coins: 2000 },
  { name: "Fri", users: 189, quizzes: 480, coins: 1500 },
  { name: "Sat", users: 239, quizzes: 380, coins: 2500 },
  { name: "Sun", users: 349, quizzes: 430, coins: 3100 },
];

export default async function AdminAnalyticsPage() {
  const userCount = await prisma.user.count();
  const quizAttemptCount = await prisma.attempt.count();
  const pendingRedemptions = await prisma.rewardRedemption.count({ where: { status: "PENDING" } });
  const unverifiedDoubts = await prisma.doubt.count({ where: { status: "UNVERIFIED" } });
  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-white italic">SYSTEM PULSE</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs mt-2 ml-1">Live Global Operations Dashboard</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Network Online</span>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: userCount.toLocaleString(), trend: "+14.2%", icon: <Users size={24} className="text-blue-400" />, up: true },
          { label: "Quizzes Attempted", value: quizAttemptCount.toLocaleString(), trend: "+8.1%", icon: <Zap size={24} className="text-violet-400" />, up: true },
          { label: "Pending Loot", value: pendingRedemptions.toString(), trend: "Urgent", icon: <Gift size={24} className="text-amber-400" />, up: false },
          { label: "Doubt Oversight", value: unverifiedDoubts.toString(), trend: "Active", icon: <Activity size={24} className="text-fuchsia-400" />, up: true },
        ].map((item, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden group hover:bg-zinc-800/50 transition-all border-l-4 border-l-transparent hover:border-l-white">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className={`flex items-center gap-1 font-black text-[10px] uppercase tracking-tighter ${item.up ? "text-emerald-500" : "text-rose-500"}`}>
                   {item.trend} {item.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
              </div>
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{item.label}</p>
              <h3 className="text-4xl font-black text-white mt-1">{item.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Engagement Chart */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 rounded-[40px] p-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                 <Activity className="text-violet-500" /> User Engagement Velocity
              </h3>
              <select className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-zinc-400">
                 <option>Last 7 Days</option>
                 <option>Last 30 Days</option>
              </select>
           </div>
           <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "16px" }}
                    itemStyle={{ color: "#fff", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Global Rankings Snapshot */}
        <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] p-8">
           <h3 className="text-xl font-black uppercase tracking-tight mb-8 text-white flex items-center gap-2">
              <Trophy className="text-amber-500" /> Top Schools
           </h3>
           <div className="space-y-6">
              {[
                { name: "Brainiacs Academy", city: "Mumbai", xp: "1.2M", rank: 1 },
                { name: "Greenwood High", city: "Bangalore", xp: "980k", rank: 2 },
                { name: "St. Stephens", city: "Delhi", xp: "850k", rank: 3 },
                { name: "Legacy International", city: "Pune", xp: "720k", rank: 4 },
                { name: "Hacker School", city: "Remote", xp: "690k", rank: 5 },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-transform">
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                        i === 0 ? "bg-amber-500/20 text-amber-500" : "bg-zinc-800 text-zinc-500"
                      }`}>
                         #{s.rank}
                      </div>
                      <div>
                         <p className="font-black text-white text-sm uppercase leading-none mb-1">{s.name}</p>
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{s.city}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-zinc-300">{s.xp}</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 p-4 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all">
              Full Global Rankings
           </button>
        </Card>
      </div>
    </div>
  );
}
