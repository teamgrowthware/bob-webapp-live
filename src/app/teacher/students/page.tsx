"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, MoreVertical, GraduationCap, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/teacher/students");
      if (res.ok) {
        setStudents(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">Student Battalion</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Manage and track your school's best minds</p>
        </div>
        <div className="flex gap-4">
           <Button className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white font-black px-6 rounded-2xl h-14">
              <Filter size={20} className="mr-2" /> FILTER
           </Button>
           <Button className="bg-violet-600 hover:bg-violet-500 text-white font-black px-8 rounded-2xl h-14 shadow-xl shadow-violet-600/20 active:scale-95 transition-all">
              <UserPlus size={20} className="mr-2" /> ADD STUDENT
           </Button>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-6">
               <div className="p-4 bg-blue-500/10 rounded-2xl">
                  <GraduationCap className="text-blue-400 w-8 h-8" />
               </div>
               <div>
                  <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Enrolled</p>
                  <h3 className="text-3xl font-black text-white">1,248</h3>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-6">
               <div className="p-4 bg-emerald-500/10 rounded-2xl">
                  <TrendingUp className="text-emerald-400 w-8 h-8" />
               </div>
               <div>
                  <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Active This Week</p>
                  <h3 className="text-3xl font-black text-white">842</h3>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center gap-6">
               <div className="p-4 bg-amber-500/10 rounded-2xl">
                  <AlertCircle className="text-amber-400 w-8 h-8" />
               </div>
               <div>
                  <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Underperforming</p>
                  <h3 className="text-3xl font-black text-white">24</h3>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Main Table Container */}
      <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
              <Input placeholder="Search by name, ID or class..." className="bg-zinc-950 border-zinc-800 text-white pl-12 h-12 rounded-xl font-bold" />
           </div>
           <div className="flex gap-2">
              <span className="px-4 py-2 bg-zinc-800 rounded-lg text-xs font-black text-white uppercase tracking-widest border border-zinc-700">All Classes</span>
              <span className="px-4 py-2 bg-zinc-950 rounded-lg text-xs font-black text-zinc-600 uppercase tracking-widest border border-zinc-900">Class 10-A</span>
           </div>
        </div>
        
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800">
              <TableHead className="font-black text-zinc-500 uppercase tracking-widest px-8">Student</TableHead>
              <TableHead className="font-black text-zinc-500 uppercase tracking-widest">Class</TableHead>
              <TableHead className="font-black text-zinc-500 uppercase tracking-widest">Total XP</TableHead>
              <TableHead className="font-black text-zinc-500 uppercase tracking-widest">Accuracy</TableHead>
              <TableHead className="font-black text-zinc-500 uppercase tracking-widest">Rank</TableHead>
              <TableHead className="font-black text-zinc-500 uppercase tracking-widest text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                 <TableCell colSpan={6} className="text-center py-24 text-zinc-500 font-bold uppercase tracking-widest">
                    Loading Battalion Data...
                 </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                 <TableCell colSpan={6} className="text-center py-24 text-zinc-500 font-bold uppercase tracking-widest">
                    No students found. Enroll them first.
                 </TableCell>
              </TableRow>
            ) : students.map((student) => (
              <TableRow key={student.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                <TableCell className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center font-black text-xs text-white shadow-lg">
                      {(student.name || "U")[0].toUpperCase()}
                    </div>
                    <div>
                       <p className="font-black text-white text-base">{student.name}</p>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{student.lastActive}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-zinc-300">{student.class}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-black text-white">{student.xp.toLocaleString()}</span>
                    <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">POINTS</span>
                  </div>
                </TableCell>
                <TableCell className="font-black text-zinc-300">{student.accuracy}</TableCell>
                <TableCell>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                      student.rank <= 3 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                   }`}>
                      #{student.rank}
                   </span>
                </TableCell>
                <TableCell className="text-right px-8">
                   <button className="p-2 text-zinc-600 hover:text-white transition-colors">
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
