"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Library, Plus, Filter, MoreVertical, CheckCircle2, AlertCircle, Eye } from "lucide-react";

export default function AdminGlobalQuizzes() {
  const [quizzes, setQuizzes] = useState([
    { id: "1", title: "National Brainiac Open", subject: "General Knowledge", author: "SYSTEM", class: "ALL", status: "LIVE", attempts: 4520 },
    { id: "2", title: "Calculus Mastery II", subject: "Math", author: "Dr. Sameer", class: "12", status: "PENDING_REVIEW", attempts: 0 },
    { id: "3", title: "Chemistry: Organic Basics", subject: "Science", author: "Prof. Malhotra", class: "11", status: "LIVE", attempts: 1240 },
    { id: "4", title: "Indian Constitution 101", subject: "Civics", author: "SYSTEM", class: "9", status: "DRAFT", attempts: 0 },
  ]);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">Global Quizzry</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Manage the collective knowledge repository</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-black px-6 rounded-2xl h-14">
              EXPORTS
           </Button>
           <Button className="bg-white text-black hover:bg-zinc-200 font-black px-8 rounded-2xl h-14 shadow-xl active:scale-95 transition-all">
              <Plus size={20} className="mr-2" /> CREATE SYSTEM QUIZ
           </Button>
        </div>
      </header>

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 flex items-center justify-between border-t-4 border-t-emerald-500">
            <div>
               <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Live Battles</p>
               <h3 className="text-3xl font-black text-white">42 Active</h3>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
               <CheckCircle2 className="text-emerald-500" size={24} />
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 flex items-center justify-between border-t-4 border-t-amber-500">
            <div>
               <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Needs Review</p>
               <h3 className="text-3xl font-black text-white">12 Pending</h3>
            </div>
            <div className="p-4 bg-amber-500/10 rounded-2xl">
               <AlertCircle className="text-amber-500" size={24} />
            </div>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 flex items-center justify-between border-t-4 border-t-violet-500">
            <div>
               <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Repos</p>
               <h3 className="text-3xl font-black text-white">850+ Quizzes</h3>
            </div>
            <div className="p-4 bg-violet-500/10 rounded-2xl">
               <Library className="text-violet-500" size={24} />
            </div>
         </Card>
      </div>

      {/* Global Quiz Table */}
      <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <Input placeholder="Search global quizzes..." className="bg-zinc-950 border-zinc-800 text-white pl-12 h-12 rounded-xl font-bold" />
           </div>
           <div className="flex gap-4">
              <Button variant="outline" className="border-zinc-800 text-zinc-400 font-black rounded-xl">
                 <Filter size={16} className="mr-2" /> FILTER BY SUBJECT
              </Button>
           </div>
        </div>

        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] px-10">Quiz Name</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Author</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Target Class</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Analytics (Attempts)</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] text-right px-10">Ops</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((q) => (
              <TableRow key={q.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors h-20">
                <TableCell className="px-10">
                   <div className="flex flex-col">
                      <span className="font-black text-white text-base leading-tight">{q.title}</span>
                      <span className="text-[10px] text-zinc-600 font-bold tracking-tight uppercase">{q.subject}</span>
                   </div>
                </TableCell>
                <TableCell>
                   <span className={`font-bold ${q.author === 'SYSTEM' ? 'text-violet-400' : 'text-zinc-400'}`}>
                      {q.author}
                   </span>
                </TableCell>
                <TableCell className="font-black text-zinc-500">CLASS {q.class}</TableCell>
                <TableCell>
                   <span className="font-black text-white">{q.attempts.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                   <span className={`px-2 py-1 rounded-md text-[10px] font-black tracking-tighter border ${
                      q.status === 'LIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      q.status === 'PENDING_REVIEW' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                      "bg-zinc-800 text-zinc-500 border-zinc-700"
                   }`}>
                      {q.status}
                   </span>
                </TableCell>
                <TableCell className="text-right px-10">
                   <div className="flex items-center justify-end gap-3">
                      <button className="text-zinc-600 hover:text-white transition-colors">
                         <Eye size={18} />
                      </button>
                      <button className="text-zinc-600 hover:text-white transition-colors">
                         <MoreVertical size={18} />
                      </button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
