"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, UserHero, UserCheck, School, MoreVertical, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([
    { id: "1", name: "Dr. Sameer", email: "sameer@school.com", role: "TEACHER", school: "Brainiacs Academy", status: "PENDING", date: "2026-03-15" },
    { id: "2", name: "Modern High School", email: "admin@modernhigh.edu", role: "SCHOOL_ADMIN", school: "Modern High", status: "APPROVED", date: "2026-03-14" },
    { id: "3", name: "Sarah Khan", email: "sarah@gmail.com", role: "STUDENT", school: "Greenwood High", status: "APPROVED", date: "2026-03-14" },
    { id: "4", name: "Prof. Malhotra", email: "malhotra@pune.edu", role: "TEACHER", school: "Pune Public", status: "PENDING", date: "2026-03-13" },
  ]);

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Access Control</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Manage Citizens, Enforcers and Territories</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-black px-6 rounded-2xl h-14">
              MASS ACTION
           </Button>
           <Button className="bg-white text-black hover:bg-zinc-200 font-black px-8 rounded-2xl h-14 shadow-xl active:scale-95 transition-all">
              INITIALIZE USER
           </Button>
        </div>
      </header>

      {/* Verification Queue */}
      <section>
         <div className="flex items-center gap-2 mb-6 ml-2">
            <ShieldAlert className="text-rose-500" size={20} />
            <h2 className="text-sm font-black text-rose-500 uppercase tracking-widest">Awaiting Verification ({users.filter(u => u.status === 'PENDING').length})</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.filter(u => u.status === 'PENDING').map((u) => (
               <Card key={u.id} className="bg-zinc-900 border-rose-500/20 rounded-[32px] overflow-hidden group hover:border-rose-500/50 transition-all shadow-2xl">
                  <CardContent className="p-8 flex justify-between items-center">
                     <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800">
                           {u.role === 'TEACHER' ? <ShieldCheck className="text-rose-500" size={32} /> : <School className="text-rose-500" size={32} />}
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-white leading-none mb-2">{u.name}</h3>
                           <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight">{u.role} @ {u.school}</p>
                           <p className="text-[10px] text-zinc-600 font-black mt-1">{u.email}</p>
                        </div>
                     </div>
                     <div className="flex flex-col gap-2">
                        <button className="bg-emerald-500/10 text-emerald-500 p-3 rounded-xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
                           <CheckCircle2 size={24} />
                        </button>
                        <button className="bg-rose-500/10 text-rose-500 p-3 rounded-xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                           <XCircle size={24} />
                        </button>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </section>

      {/* Global User Table */}
      <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <Input placeholder="Search global registry..." className="bg-zinc-950 border-zinc-800 text-white pl-12 h-12 rounded-xl font-bold" />
           </div>
           <div className="flex gap-4">
              {['ALL', 'STUDENT', 'TEACHER', 'SCHOOL'].map(f => (
                <button key={f} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                   f === 'ALL' ? "bg-white text-black border-white" : "bg-zinc-950 text-zinc-600 border-zinc-800 hover:text-white"
                }`}>
                   {f}
                </button>
              ))}
           </div>
        </div>

        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800 h-16">
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] px-10">User Identity</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Territory (School)</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Permission Tier</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Standing</TableHead>
              <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] text-right px-10">Operations</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors h-20">
                <TableCell className="px-10">
                   <div className="flex flex-col">
                      <span className="font-black text-white text-base leading-tight">{u.name}</span>
                      <span className="text-[10px] text-zinc-600 font-bold tracking-tight">{u.email}</span>
                   </div>
                </TableCell>
                <TableCell className="font-bold text-zinc-400">{u.school}</TableCell>
                <TableCell>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                      u.role === 'TEACHER' ? "bg-violet-500/10 text-violet-400 border-violet-500/20" :
                      u.role === 'SCHOOL_ADMIN' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-zinc-800 text-zinc-500 border-zinc-700"
                   }`}>
                      {u.role}
                   </span>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'APPROVED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                         {u.status}
                      </span>
                   </div>
                </TableCell>
                <TableCell className="text-right px-10">
                   <button className="text-zinc-600 hover:text-white transition-colors">
                      <MoreVertical size={20} />
                   </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
