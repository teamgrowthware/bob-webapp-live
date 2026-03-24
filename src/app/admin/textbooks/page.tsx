"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Book, Upload, Loader2, BookOpen } from "lucide-react";

export default function AdminTextbooksPage() {
  const [textbooks, setTextbooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTextbooks();
  }, []);

  const fetchTextbooks = async () => {
    try {
      const res = await fetch("/api/admin/textbooks");
      if (res.ok) {
        setTextbooks(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !classLevel || !subject) return;

    setUploading(true);
    setMsg("");
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("class", classLevel);
    formData.append("subject", subject);

    try {
      const res = await fetch("/api/admin/textbooks/upload", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setMsg("Textbook uploaded and vectorized successfully!");
        setName("");
        setClassLevel("");
        setSubject("");
        
        // Reset file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setFile(null);
        
        await fetchTextbooks();
      } else {
        const data = await res.json();
        setMsg(data.error || "Upload failed.");
      }
    } catch (e) {
      setMsg("Error connecting to server.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-10 space-y-10 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">Curriculum Vault</h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">Manage Vector Embeddings for AI Quizzes</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <Card className="bg-zinc-900 border-zinc-800 rounded-3xl">
              <CardContent className="p-8">
                <h2 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                   <Upload className="text-violet-500" /> Ingest PDF
                </h2>
                {msg && (
                  <div className="p-4 mb-6 bg-zinc-950 border border-zinc-800 text-violet-400 rounded-xl font-bold text-xs uppercase tracking-widest text-center">
                    {msg}
                  </div>
                )}
                <form onSubmit={handleUpload} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Textbook Name</label>
                     <Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. NCERT Science" className="bg-zinc-950 border-zinc-800 h-12 text-white font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Class</label>
                        <Input required value={classLevel} onChange={e => setClassLevel(e.target.value)} placeholder="10" className="bg-zinc-950 border-zinc-800 h-12 text-white font-bold" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Subject</label>
                        <Input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="Science" className="bg-zinc-950 border-zinc-800 h-12 text-white font-bold" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">PDF File</label>
                     <Input id="file-upload" type="file" required accept=".pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="bg-zinc-950 border-zinc-800 h-12 text-white font-bold pt-2.5 cursor-pointer file:text-violet-500 file:font-black file:uppercase file:bg-transparent file:border-0" />
                  </div>
                  
                  <Button type="submit" disabled={uploading} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black h-12 uppercase tracking-widest">
                     {uploading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Vectorizing...</> : "Upload & Vectorize"}
                  </Button>
                </form>
              </CardContent>
           </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
           {loading ? (
             <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-zinc-600" /></div>
           ) : textbooks.length === 0 ? (
             <div className="p-20 border-2 border-dashed border-zinc-800 rounded-3xl text-center">
                <BookOpen className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                <h3 className="text-zinc-500 font-black uppercase tracking-widest">Vault is Empty</h3>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {textbooks.map(tb => (
                  <Card key={tb.id} className="bg-zinc-900 border-zinc-800 rounded-3xl hover:border-violet-500/50 transition-colors">
                     <CardContent className="p-6">
                        <div className="flex gap-4 items-start">
                           <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center border border-violet-500/20 shrink-0">
                              <Book className="text-violet-400" />
                           </div>
                           <div>
                              <h3 className="text-white font-black uppercase text-lg leading-tight mb-1">{tb.name}</h3>
                              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Class {tb.class} • {tb.subject}</p>
                              
                              <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="text-[10px] font-black px-3 py-1 bg-zinc-950 text-emerald-500 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
                                  {tb.chapters?.length || 0} Parts
                                </span>
                                <span className="text-[10px] font-black px-3 py-1 bg-zinc-950 text-fuchsia-500 rounded-lg border border-fuchsia-500/20 uppercase tracking-widest">
                                  Vectorized
                                </span>
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
