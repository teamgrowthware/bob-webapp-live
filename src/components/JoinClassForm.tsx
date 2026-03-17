"use client";

import { useState } from "react";
import { Code, Loader2 } from "lucide-react";

export default function JoinClassForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/student/classes/join", {
        method: "POST",
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Successfully joined ${data.className}!`);
        setCode("");
        // Reload page to show new class
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(data.error || "Failed to join class");
      }
    } catch (e) {
      setError("Network error joining class");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleJoin} className="space-y-3">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">
             <Code size={16} />
          </div>
          <input 
            type="text" 
            placeholder="INVITE CODE" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={10}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-4 h-12 text-white font-mono font-bold text-sm uppercase focus:border-violet-500/50 outline-none transition-all"
          />
        </div>
        <button 
          disabled={loading}
          className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded-xl font-black uppercase italic text-xs transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin mx-auto w-4 h-4" /> : "Join Squad"}
        </button>
      </form>
      
      {error && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 text-center">{error}</p>}
      {success && <p className="text-green-500 text-[10px] font-bold uppercase mt-2 text-center">{success}</p>}
    </div>
  );
}
