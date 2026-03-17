import { PrismaClient } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Brain, Download, School, User, Target, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function LeadsPage() {
  const leads = await prisma.waitlist.findMany({
    orderBy: { createdAt: "desc" }
  });

  const students = leads.filter(l => l.type === "STUDENT");
  const schools = leads.filter(l => l.type === "SCHOOL");

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Lead Intelligence</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Conversion funnel monitoring</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-black px-6 rounded-2xl h-14">
              <Download size={20} className="mr-2" /> EXPORT CSV
           </Button>
        </div>
      </header>

      {/* Interest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-white">
                  <Target size={24} />
               </div>
               <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full uppercase">Live</span>
            </div>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Interest</p>
            <h3 className="text-4xl font-black text-white mt-1">{leads.length}</h3>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
               <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-violet-400">
                  <User size={24} />
               </div>
               <span className="text-[10px] font-black text-violet-500 bg-violet-500/10 px-2 py-1 rounded-full uppercase">Waitlist</span>
            </div>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Students</p>
            <h3 className="text-4xl font-black text-white mt-1">{students.length}</h3>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl p-8 overflow-hidden group border-t-4 border-t-fuchsia-600">
            <div className="flex justify-between items-start mb-4">
               <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-fuchsia-400">
                  <School size={24} />
               </div>
               <span className="text-[10px] font-black text-fuchsia-500 bg-fuchsia-500/10 px-2 py-1 rounded-full uppercase">High Intent</span>
            </div>
            <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">School Leads</p>
            <h3 className="text-4xl font-black text-white mt-1">{schools.length}</h3>
         </Card>
      </div>

      <div className="space-y-12">
           {/* Students Table */}
           <section>
              <div className="flex items-center gap-2 mb-6 ml-2">
                 <div className="w-2 h-2 bg-violet-500 rounded-full" />
                 <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Student Deployment Queue</h2>
              </div>
              <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl">
                 <Table>
                    <TableHeader className="bg-zinc-950/50">
                       <TableRow className="border-zinc-800 h-16">
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] px-10">Identity</TableHead>
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Tier</TableHead>
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Location</TableHead>
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] text-right px-10">Time Stamped</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {students.map((lead) => (
                         <TableRow key={lead.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors h-20">
                            <TableCell className="px-10">
                               <div className="flex flex-col">
                                  <span className="font-black text-white text-base leading-none mb-1">{lead.name}</span>
                                  <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1 uppercase">
                                     <Phone size={10} className="text-violet-500" /> {lead.phone}
                                  </span>
                               </div>
                            </TableCell>
                            <TableCell>
                               <span className="px-3 py-1 bg-zinc-950 rounded-lg text-xs font-black text-zinc-400 border border-zinc-800 uppercase italic">
                                  Class {lead.class}
                               </span>
                            </TableCell>
                            <TableCell>
                               <span className="text-zinc-400 font-bold flex items-center gap-2">
                                  <MapPin size={14} className="text-zinc-600" /> {lead.city}
                               </span>
                            </TableCell>
                            <TableCell className="text-right px-10 font-black text-zinc-700 text-[10px]">
                               {new Date(lead.createdAt).toLocaleString()}
                            </TableCell>
                         </TableRow>
                       ))}
                       {students.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-12 text-zinc-600 font-black uppercase tracking-widest">No students detected in the perimeter.</TableCell></TableRow>}
                    </TableBody>
                 </Table>
              </Card>
           </section>

           {/* Schools Table */}
           <section>
              <div className="flex items-center gap-2 mb-6 ml-2">
                 <div className="w-2 h-2 bg-fuchsia-500 rounded-full" />
                 <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Territory Partnerships (Schools)</h2>
              </div>
              <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl">
                 <Table>
                    <TableHeader className="bg-zinc-950/50">
                       <TableRow className="border-zinc-800 h-16">
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] px-10">School Territory</TableHead>
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Contact Intel</TableHead>
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px]">Zone</TableHead>
                          <TableHead className="font-black text-zinc-600 uppercase tracking-widest text-[10px] text-right px-10">Status</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {schools.map((lead) => (
                         <TableRow key={lead.id} className="border-zinc-800 hover:bg-zinc-800/20 transition-colors h-20">
                            <TableCell className="px-10">
                               <span className="font-black text-white text-base uppercase italic underline decoration-fuchsia-500/30 decoration-2 underline-offset-4">{lead.name}</span>
                            </TableCell>
                            <TableCell className="text-zinc-400 font-black text-xs">{lead.phone}</TableCell>
                            <TableCell className="text-zinc-400 font-bold">{lead.city}</TableCell>
                            <TableCell className="text-right px-10">
                               <span className="px-4 py-1.5 rounded-full bg-fuchsia-500/10 text-fuchsia-500 text-[10px] font-black uppercase tracking-widest border border-fuchsia-500/20">New Intel</span>
                            </TableCell>
                         </TableRow>
                       ))}
                       {schools.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-12 text-zinc-600 font-black uppercase tracking-widest">No territories requesting contact.</TableCell></TableRow>}
                    </TableBody>
                 </Table>
              </Card>
           </section>
        </div>
    </div>
  );
}
