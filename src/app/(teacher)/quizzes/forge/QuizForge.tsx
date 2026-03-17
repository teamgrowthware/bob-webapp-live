"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, BookOpen, Sparkles, Loader2, CheckCircle2, ChevronRight, FileText, Trash2, Edit3, Save } from "lucide-react";

export default function QuizForge() {
  // Ingestion State
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestStatus, setIngestStatus] = useState<"IDLE" | "UPLOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [ingestMsg, setIngestMsg] = useState("");

  // Forge State
  const [view, setView] = useState<"SELECT" | "REVIEW">("SELECT");
  const [textbooks, setTextbooks] = useState<any[]>([]);
  const [selectedTextbook, setSelectedTextbook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [topic, setTopic] = useState("");
  const [forgeLoading, setForgeLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  useEffect(() => {
    fetchTextbooks();
  }, []);

  const fetchTextbooks = async () => {
    try {
      const res = await fetch("/api/admin/textbooks");
      if (res.ok) {
        const data = await res.json();
        setTextbooks(data);
      }
    } catch (e) {
      console.error("Failed to fetch textbooks");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !name || !classLevel || !subject) return;

    setIngestLoading(true);
    setIngestStatus("UPLOADING");
    setIngestMsg("Parsing PDF and generating embeddings... This may take a minute.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);
    formData.append("class", classLevel);
    formData.append("subject", subject);

    try {
      const res = await fetch("/api/admin/textbooks/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setIngestStatus("SUCCESS");
        setIngestMsg(`Textbook "${name}" ingested! ${data.chunksProcessed} chunks stored.`);
        fetchTextbooks();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
    } catch (err: any) {
      setIngestStatus("ERROR");
      setIngestMsg(err.message);
    } finally {
      setIngestLoading(false);
    }
  };

  const handleForge = async () => {
    if (!selectedChapter) return;
    setForgeLoading(true);

    try {
      const res = await fetch("/api/ai/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId: selectedChapter, difficulty, topic, count: 5 }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQuestions(data.questions);
        setView("REVIEW");
      }
    } catch (e) {
      console.error("Forge failed");
    } finally {
      setForgeLoading(false);
    }
  };

  if (view === "REVIEW") {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Review Generated Questions</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-2">Personalize your battle drop</p>
          </div>
          <Button 
            onClick={() => setView("SELECT")} 
            variant="outline" 
            className="bg-zinc-950 border-zinc-800 text-zinc-400 rounded-xl font-bold"
          >
            Back to Forge
          </Button>
        </div>

        <div className="space-y-4">
          {generatedQuestions.map((q, qIdx) => (
            <Card key={qIdx} className="bg-zinc-900 border-zinc-800 overflow-hidden rounded-3xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <span className="bg-violet-600/20 text-violet-400 text-[10px] font-black px-3 py-1 rounded-full border border-violet-500/20">QUESTION {qIdx + 1}</span>
                   <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-600 hover:text-white"><Edit3 size={14} /></Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-zinc-600 hover:text-rose-500"
                        onClick={() => setGeneratedQuestions(prev => prev.filter((_, i) => i !== qIdx))}
                      >
                        <Trash2 size={14} />
                      </Button>
                   </div>
                </div>
                <p className="text-white font-bold text-lg mb-6 leading-tight italic">"{q.text}"</p>
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt: string, oIdx: number) => (
                    <div 
                      key={oIdx} 
                      className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                        oIdx === q.correctIdx 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-zinc-950/50 border-zinc-800 text-zinc-500"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p className="mt-6 p-4 bg-zinc-950 rounded-2xl text-zinc-500 text-xs italic font-medium border border-zinc-800/50">
                    <span className="text-violet-400 font-black not-italic uppercase tracking-widest mr-2">Context Check:</span>
                    {q.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Button className="w-full h-16 bg-white text-zinc-950 hover:bg-emerald-500 hover:text-white rounded-[32px] font-black text-xl uppercase italic transition-all group shadow-2xl shadow-white/5">
           <Save className="mr-3 group-hover:scale-110 transition-transform" /> Publish to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-zinc-900 border border-zinc-800 p-8 rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] -z-10" />
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">AI Quiz Forge</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Curriculum-Aligned Intelligence Engine</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-zinc-950/50 px-4 py-2 rounded-2xl border border-zinc-800 flex items-center gap-2">
              <BookOpen className="text-violet-400 w-4 h-4" />
              <span className="text-xs font-bold text-zinc-400">Vector Search Ready</span>
           </div>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Step 1: Upload Source */}
        <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] md:col-span-2">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-black italic">1</div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Ingest Textbook</h2>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Textbook Name</label>
                  <Input 
                    placeholder="e.g. NCERT Science" 
                    className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Subject</label>
                  <Input 
                    placeholder="e.g. Physics" 
                    className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Class Level</label>
                    <select 
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl h-12 px-4 text-sm font-bold appearance-none"
                      value={classLevel}
                      onChange={e => setClassLevel(e.target.value)}
                    >
                      <option value="">Select Class</option>
                      {["6", "7", "8", "9", "10", "11", "12"].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Syllabus PDF</label>
                    <div className="relative group">
                       <input 
                         type="file" 
                         accept="application/pdf"
                         onChange={e => setFile(e.target.files?.[0] || null)}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                       />
                       <div className="bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-xl h-12 flex items-center justify-center gap-2 text-zinc-500 text-sm font-bold group-hover:border-violet-500/50 transition-colors">
                          <Upload size={16} />
                          {file ? file.name : "Select PDF Document"}
                       </div>
                    </div>
                 </div>
              </div>

              <Button 
                type="submit" 
                disabled={ingestLoading || !file}
                className="w-full h-14 bg-zinc-800 text-white hover:bg-zinc-700/50 rounded-2xl font-black uppercase italic tracking-tighter"
              >
                {ingestLoading ? <><Loader2 className="animate-spin mr-2" /> Indexing...</> : "Sync with Vector Vault"}
              </Button>

              {ingestStatus !== "IDLE" && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 font-bold text-sm ${
                  ingestStatus === "SUCCESS" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : 
                  ingestStatus === "UPLOADING" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                  "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}>
                  {ingestStatus === "SUCCESS" ? <CheckCircle2 size={18} /> : ingestStatus === "UPLOADING" ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                  {ingestMsg}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Step 2: Forge */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden group border-violet-500/20 shadow-2xl shadow-violet-500/5">
            <CardContent className="p-8">
              <Sparkles className="text-amber-500 mb-6" size={40} />
              <h3 className="text-2xl font-black text-white uppercase italic leading-none">Forge Quiz</h3>
              <p className="text-zinc-500 text-xs font-bold mt-2 leading-relaxed">Synthesize context-aware battle drops using RAG logic.</p>
              
              <div className="mt-8 space-y-4">
                <select 
                  className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl h-12 px-4 text-xs font-black uppercase tracking-widest"
                  value={selectedTextbook}
                  onChange={e => setSelectedTextbook(e.target.value)}
                >
                  <option value="">Select Textbook</option>
                  {textbooks.map(t => <option key={t.id} value={t.id}>{t.name} (Class {t.class})</option>)}
                </select>

                {selectedTextbook && (
                  <select 
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl h-12 px-4 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-2"
                    value={selectedChapter}
                    onChange={e => setSelectedChapter(e.target.value)}
                  >
                    <option value="">Select Chapter</option>
                    {textbooks.find(t => t.id === selectedTextbook)?.chapters.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                )}

                <Input 
                  placeholder="Target Topic (Optional)" 
                  className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 text-xs font-bold"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleForge}
                disabled={forgeLoading || !selectedChapter}
                className="w-full mt-8 bg-white text-zinc-950 rounded-2xl h-14 font-black italic hover:bg-zinc-200 flex items-center justify-center transition-all disabled:opacity-50"
              >
                {forgeLoading ? <><Loader2 className="animate-spin mr-2" /> Igniting Forge...</> : <>Burn Quiz <Sparkles className="ml-2 w-4 h-4" /></>}
              </Button>
            </CardContent>
          </Card>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-6">
             <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Ingestion Stats</h4>
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-zinc-400 text-xs font-bold">Vector Vault</span>
                   <span className="text-white font-black">{textbooks.length} Books</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                   <div className="h-full bg-violet-500 w-[65%]" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
