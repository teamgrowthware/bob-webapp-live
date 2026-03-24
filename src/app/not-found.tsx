
import Link from "next/link";
import { Brain } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 text-center">
       <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-4 rounded-3xl mb-8 animate-bounce-slow">
          <Brain className="w-12 h-12 text-white" />
       </div>
       <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4 leading-none">
          Sector <span className="text-violet-500">404</span> Not Found
       </h1>
       <p className="text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-12">The intelligence you seek is currently offline.</p>
       <Link href="/">
          <button className="h-16 px-10 rounded-2xl bg-white text-black font-black uppercase italic text-lg hover:bg-violet-500 hover:text-white transition-all shadow-xl active:scale-95">
             Return to Base
          </button>
       </Link>
    </div>
  );
}
