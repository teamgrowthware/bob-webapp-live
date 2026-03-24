"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { School, Plus, Trash2, Save, Sparkles, Loader2, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeacherQuizzesPage() {
  const [viewMode, setViewMode] = useState<"MANUAL" | "AI">("MANUAL");

  // Manual Form State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correctIdx: 0 }]);
  const [manualLoading, setManualLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // AI Form State
  const [aiTopic, setAiTopic] = useState("");
  const [aiClassLevel, setAiClassLevel] = useState("");
  const [aiCount, setAiCount] = useState("5");
  const [aiContext, setAiContext] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [aiTopics, setAiTopics] = useState<string[]>([]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", "", "", ""], correctIdx: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQ = [...questions];
    (newQ[index] as any)[field] = value;
    setQuestions(newQ);
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const newQ = [...questions];
    newQ[qIndex].options[optIndex] = value;
    setQuestions(newQ);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/teacher/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, questions })
      });
      if (res.ok) {
        setMsg("Quiz dropped successfully!");
        setTitle("");
        setSubject("");
        setQuestions([{ text: "", options: ["", "", "", ""], correctIdx: 0 }]);
      } else {
        setMsg("Failed to drop quiz.");
      }
    } catch (err) {
      setMsg("Error submitting quiz.");
    } finally {
      setManualLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParsingPdf(true);
    setAiMsg("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/teacher/parse-file", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setAiContext(data.text);
        setAiTopics(data.topics || []);
        if (data.suggestedClass) setAiClassLevel(data.suggestedClass);
        if (data.suggestedSubject) setAiTopic(data.suggestedSubject);
        setAiMsg("✨ Syllabus analyzed! Topics extracted.");
      } else {
        setAiMsg("❌ Failed to analyze file.");
      }
    } catch (err) {
      setAiMsg("❌ Error processing file.");
    } finally {
      setParsingPdf(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);
    setAiMsg("");
    try {
      const res = await fetch("/api/teacher/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          classLevel: aiClassLevel,
          count: aiCount,
          context: aiContext
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAiMsg(`⚡ AI Quiz created successfully! (${data.quiz.questions.length} questions)`);
        setAiTopic("");
        setAiClassLevel("");
        setAiCount("5");
      } else {
        const err = await res.json();
        setAiMsg(`Failed to generate: ${err.error}`);
      }
    } catch (err) {
      setAiMsg("Error communicating with AI endpoint.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
           <Link href="/teacher" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-2 font-bold text-xs uppercase tracking-widest transition-colors">
              <ArrowLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-4xl font-black tracking-tight text-white uppercase">Quiz Forge</h1>
           <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-1">Deploy New Brain Battles</p>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 p-1.5 rounded-2xl shadow-xl">
          <button
            onClick={() => setViewMode("MANUAL")}
            className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${viewMode === "MANUAL" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            MANUAL
          </button>
          <button
            onClick={() => setViewMode("AI")}
            className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${viewMode === "AI" ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-600/20" : "text-zinc-500 hover:text-violet-400"}`}
          >
            <Sparkles className="w-4 h-4" /> AI GEN
          </button>
        </div>
      </header>

      {viewMode === "MANUAL" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {msg && <div className="p-4 bg-violet-600/20 border border-violet-500/50 text-violet-300 rounded-xl font-black text-xs uppercase tracking-widest">{msg}</div>}

          <form onSubmit={handleManualSubmit} className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
              <CardContent className="p-10 space-y-6">
                <h2 className="text-xl font-black uppercase text-white tracking-tight">Quiz Parameters</h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Mission Title</label>
                    <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Weekly Math Battle" className="bg-zinc-950 border-zinc-800 text-white h-14 rounded-2xl px-6 font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Subject Area</label>
                    <Input required value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Mathematics" className="bg-zinc-950 border-zinc-800 text-white h-14 rounded-2xl px-6 font-bold" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
               {questions.map((q, idx) => (
                <Card key={idx} className="bg-zinc-900 border-zinc-800 rounded-[32px] overflow-hidden group">
                  <CardContent className="p-10 space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-violet-600/20 rounded-xl flex items-center justify-center font-black text-violet-400">
                           {idx + 1}
                         </div>
                         <h3 className="font-black text-white uppercase tracking-tight">Question Block</h3>
                      </div>
                      {idx > 0 && (
                        <button type="button" onClick={() => setQuestions(questions.filter((_, i) => i !== idx))} className="text-red-500/50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Prompt Text</label>
                       <Input required value={q.text} onChange={e => handleQuestionChange(idx, "text", e.target.value)} placeholder="Engaging question text..." className="bg-zinc-950 border-zinc-800 text-white font-bold h-14 rounded-2xl px-6" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`flex items-center gap-4 bg-zinc-950 p-4 rounded-2xl border transition-all ${q.correctIdx === optIdx ? "border-violet-500 bg-violet-500/5" : "border-zinc-800"}`}>
                          <input
                            type="radio"
                            name={`correct-${idx}`}
                            checked={q.correctIdx === optIdx}
                            onChange={() => handleQuestionChange(idx, "correctIdx", optIdx)}
                            className="w-5 h-5 accent-violet-500 cursor-pointer"
                          />
                          <Input required value={opt} onChange={e => handleOptionChange(idx, optIdx, e.target.value)} placeholder={`Choice ${optIdx + 1}`} className="bg-transparent border-none text-white font-bold h-10 px-0 focus-visible:ring-0" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 pb-20">
              <Button type="button" onClick={handleAddQuestion} variant="outline" className="w-full sm:w-auto border-zinc-800 text-zinc-400 hover:bg-zinc-900 font-black h-14 px-8 rounded-2xl transition-all">
                <Plus className="w-5 h-5 mr-3" /> ADD QUESTION
              </Button>
              <Button type="submit" disabled={manualLoading} className="w-full sm:w-auto bg-violet-600 text-white hover:bg-violet-500 font-black h-14 px-12 rounded-2xl shadow-xl shadow-violet-600/20 active:scale-95 transition-all text-lg uppercase tracking-wide">
                {manualLoading ? "COMMITTING..." : "DEPLOY QUIZ"}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {aiMsg && <div className="p-4 bg-fuchsia-600/20 border border-fuchsia-500/50 text-fuchsia-300 rounded-xl font-black text-xs uppercase tracking-widest">{aiMsg}</div>}

          <Card className="bg-zinc-900 border-zinc-800 rounded-[40px] overflow-hidden relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-fuchsia-600/5 pointer-events-none" />
            <CardContent className="p-10 md:p-16 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-violet-600/20 mb-8 border border-violet-500/20">
                  <Sparkles className="w-10 h-10 text-violet-400" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">AI PROMPT ENGIN</h2>
                <p className="text-zinc-500 font-medium max-w-lg mx-auto">Generate syllabus-accurate battles in seconds using Google Gemini.</p>
              </div>

              <form onSubmit={handleAiSubmit} className="max-w-xl mx-auto space-y-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Target Topic</label>
                    <Input required value={aiTopic} onChange={e => setAiTopic(e.target.value)} placeholder="e.g. Modern History: French Revolution" className="bg-zinc-950 border-zinc-800 text-white font-bold h-16 px-6 rounded-2xl" />
                  </div>

                  <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-500" /> Syllabus Context
                      </label>
                      {parsingPdf && <Loader2 className="w-4 h-4 animate-spin text-fuchsia-500" />}
                    </div>
                    
                    <div className="flex flex-col gap-6">
                      <label className="flex items-center justify-start gap-4 px-6 py-5 bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl cursor-pointer hover:bg-zinc-800 transition-all text-sm font-bold text-zinc-400">
                        <Plus className="w-5 h-5 text-violet-400" />
                        <div className="flex flex-col text-left">
                           <span className="text-white">Upload Reference Materia</span>
                           <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">PDF or Images (Gemini Vision)</span>
                        </div>
                        <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} disabled={parsingPdf} />
                      </label>
                      
                      {aiTopics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {aiTopics.map((topic, i) => (
                            <span key={i} className="text-[10px] font-black bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1.5 rounded-full uppercase tracking-widest">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Tier (Class)</label>
                    <Input required value={aiClassLevel} onChange={e => setAiClassLevel(e.target.value)} placeholder="6-12" type="number" min="1" max="12" className="bg-zinc-950 border-zinc-800 text-white h-16 rounded-2xl px-6 font-black" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Loot Count</label>
                    <Input required value={aiCount} onChange={e => setAiCount(e.target.value)} placeholder="5" type="number" min="1" max="25" className="bg-zinc-950 border-zinc-800 text-white h-16 rounded-2xl px-6 font-black" />
                  </div>
                </div>

                <Button type="submit" disabled={aiLoading} className="w-full h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-[1.02] text-white font-black text-xl mt-8 rounded-2xl shadow-2xl shadow-violet-600/30 active:scale-95 transition-all uppercase tracking-widest">
                  {aiLoading ? (
                    <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> ENGAGING AI...</>
                  ) : (
                    <><Sparkles className="w-6 h-6 mr-3" /> GENERATE BATTLE</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
