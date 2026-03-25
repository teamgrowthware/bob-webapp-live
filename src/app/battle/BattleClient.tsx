"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Swords, User as UserIcon, Timer, CheckCircle2, XCircle } from "lucide-react";
import SavageFeedback from "@/components/SavageFeedback";
import Confetti from "@/components/Confetti";

type Player = { userId: string; userName: string; avatar: string };
type Question = { id: string; text: string; options: string[]; timeLimit: number };
type BattleState = "LOBBY" | "MATCHMAKING" | "VS_SCREEN" | "PLAYING" | "GAME_OVER";

export default function BattleClient({ currentUser }: { currentUser: { id: string; name: string; streak: number } }) {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  const [battleState, setBattleState] = useState<BattleState>("LOBBY");
  const [roomId, setRoomId] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [opponent, setOpponent] = useState<Player | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Game State
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [winner, setWinner] = useState<string | null>(null);
  const [finalScores, setFinalScores] = useState({ me: 0, opp: 0 });

  useEffect(() => {
    const socket = io(window.location.origin, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3
    });
    socketRef.current = socket;

    socket.on("match_found", (data) => {
      setRoomId(data.roomId);
      setQuestions(data.questions);
      const opp = data.players.find((p: Player) => p.userId !== currentUser.id);
      setOpponent(opp);
      setBattleState("VS_SCREEN");
      setTimeout(() => {
        setBattleState("PLAYING");
        setTimeLeft(data.questions[0].timeLimit);
      }, 3000);
    });

    socket.on("score_updated", (scores: Record<string, number>) => {
      setMyScore(scores[currentUser.id] || 0);
      const oppId = Object.keys(scores).find(id => id !== currentUser.id);
      if (oppId) setOppScore(scores[oppId] || 0);
    });

    socket.on("battle_result", (result) => {
      setWinner(result.winnerId);
      setFinalScores({
        me: result.p1Score > result.p2Score ? (result.winnerId === currentUser.id ? result.p1Score : result.p2Score) : result.p1Score,
        opp: result.p2Score
      });
      setBattleState("GAME_OVER");
    });

    return () => { socket.disconnect(); };
  }, [currentUser]);

  // --- BOT FALLBACK LOGIC ---
  useEffect(() => {
    if (battleState !== "MATCHMAKING") return;

    const botTimeout = setTimeout(() => {
      console.log("Matchmaking timed out, starting Bot Match...");
      
      const MOCK_BOT_QUESTIONS = [
        { id: "bq1", text: "Which is the fastest animal on land?", options: ["Lion", "Cheetah", "Horse", "Eagle"], timeLimit: 15 },
        { id: "bq2", text: "What is 15 x 15?", options: ["225", "255", "215", "205"], timeLimit: 15 },
        { id: "bq3", text: "What does 'HTTP' stand for?", options: ["Hyper Text Transfer Protocol", "High Tier Text Processing", "Hyper Transfer Text Path", "Host Text Terminal Protocol"], timeLimit: 15 },
        { id: "bq4", text: "If a train travels 120km in 2 hours, what is its speed?", options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"], timeLimit: 15 },
        { id: "bq5", text: "Identify the odd one out.", options: ["Python", "Java", "C++", "HTML"], timeLimit: 15 }
      ];

      setQuestions(MOCK_BOT_QUESTIONS);
      setOpponent({ userId: "bot-9000", userName: "SavageBot_9000", avatar: "avatar-3.png" });
      setBattleState("VS_SCREEN");

      setTimeout(() => {
        setBattleState("PLAYING");
        setTimeLeft(15);
      }, 3000);
    }, 5000); // 5 seconds wait

    return () => clearTimeout(botTimeout);
  }, [battleState]);

  // Simulate Bot Score
  useEffect(() => {
    if (battleState !== "PLAYING" || !opponent?.userId.startsWith("bot")) return;

    const botThinking = setInterval(() => {
      setOppScore(prev => prev + (Math.random() > 0.6 ? Math.floor(Math.random() * 100) : 0));
    }, 4000);

    return () => clearInterval(botThinking);
  }, [battleState, opponent]);

  // Handle countdown timer
  useEffect(() => {
    if (battleState !== "PLAYING") return;

    if (timeLeft <= 0) {
      handleNext(-1); // Auto skip if time runs out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, battleState]);

  const handleNext = (selectedOptionIndex: number) => {
    if (battleState !== "PLAYING") return;

    const points = selectedOptionIndex !== -1 ? Math.floor(Math.random() * 50) + 50 : 0;
    
    // Update local score
    setMyScore(prev => prev + points);

    // Sync with server if socket is active
    if (socketRef.current && roomId) {
      socketRef.current.emit("update_score", { roomId, userId: currentUser.id, points });
    }

    if (currentQIndex < questions.length - 1) {
      const nextQ = questions[currentQIndex + 1];
      setCurrentQIndex(prev => prev + 1);
      setTimeLeft(nextQ.timeLimit || 15);
    } else {
      // End Battle
      if (socketRef.current && roomId) {
        socketRef.current.emit("battle_end", { roomId });
      } else {
        // Local Bot Match End
        setWinner(myScore + points >= oppScore ? currentUser.id : opponent?.userId || "bot");
        setFinalScores({ me: myScore + points, opp: oppScore });
        setBattleState("GAME_OVER");
      }
    }
  };

  const startRandomMatch = () => {
    if (socketRef.current) {
      setBattleState("MATCHMAKING");
      socketRef.current.emit("join_queue", { userId: currentUser.id, userName: currentUser.name });
    }
  };

  const createPrivateRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    if (socketRef.current) {
      setBattleState("MATCHMAKING");
      socketRef.current.emit("create_private", { roomCode: code, userId: currentUser.id, userName: currentUser.name });
    }
  };

  const joinPrivateRoom = (code: string) => {
    if (socketRef.current && code.length === 6) {
      setBattleState("MATCHMAKING");
      socketRef.current.emit("join_private", { roomCode: code, userId: currentUser.id, userName: currentUser.name });
    }
  };

  if (battleState === "LOBBY") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
        <div className="w-full max-w-md space-y-12 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-violet-600/20 rounded-[32px] flex items-center justify-center mx-auto border border-violet-500/30">
              <Swords className="w-10 h-10 text-violet-400" />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Battle Arena</h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Choose your deployment</p>
          </div>

          <div className="grid gap-4">
            <button 
              onClick={startRandomMatch}
              className="group relative h-24 bg-white hover:bg-zinc-200 rounded-[24px] overflow-hidden transition-all active:scale-95 text-left p-6"
            >
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h3 className="text-black font-black text-xl uppercase italic">Random Hunt</h3>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Global Matchmaking</p>
                </div>
                <Zap className="text-black group-hover:scale-125 transition-transform" size={32} />
              </div>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-900"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.4em] font-black text-zinc-700 bg-zinc-950 px-4">OR CHALLENGE A FRIEND</div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={createPrivateRoom}
                className="w-full h-16 bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 rounded-[18px] text-zinc-400 hover:text-white font-black uppercase tracking-widest text-xs transition-all"
              >
                Assemble Private Squad
              </button>
              
              <div className="flex gap-2">
                <input 
                  placeholder="ENTER ROOM CODE"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-[18px] px-6 text-xs font-black text-white placeholder:text-zinc-700 focus:outline-none focus:border-violet-500"
                  maxLength={6}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />
                <button 
                  disabled={roomCode.length !== 6}
                  onClick={() => joinPrivateRoom(roomCode)}
                  className="h-14 w-14 bg-white rounded-[18px] flex items-center justify-center text-black disabled:opacity-30 transition-all active:scale-90"
                >
                  <Swords size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (battleState === "MATCHMAKING") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-violet-600 rounded-full blur-[100px] opacity-20 animate-pulse" />
          <div className="w-32 h-32 rounded-full border-4 border-dashed border-violet-500/50 animate-[spin_4s_linear_infinite] flex items-center justify-center relative z-10">
            <Swords className="w-12 h-12 text-violet-400 animate-[spin_4s_linear_infinite_reverse]" />
          </div>
        </div>
        <h2 className="text-3xl font-black mt-12 mb-2 animate-pulse text-white uppercase italic">
          {roomCode && !roomId ? `Awaiting Rival... [${roomCode}]` : "Scanning Sector..."}
        </h2>
        <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
          {roomCode && !roomId ? "Share this code with your friend" : "Finding a worthy opponent in your class."}
        </p>
        <Button variant="ghost" className="mt-8 text-zinc-600 hover:text-white font-black uppercase tracking-widest" onClick={() => window.location.reload()}>Abort Mission</Button>
      </div>
    );
  }

  if (battleState === "VS_SCREEN") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-zinc-950">
        <div className="flex items-center justify-center gap-8 md:gap-16 w-full max-w-4xl">
          <div className="flex flex-col items-center animate-in slide-in-from-left duration-700">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 rounded-2xl border-2 border-violet-500 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <UserIcon className="w-12 h-12 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mt-4 text-white">{currentUser.name.split(" ")[0]}</h3>
          </div>

          <div className="text-5xl md:text-7xl font-black italic text-zinc-800 scale-150 animate-pulse">VS</div>

          <div className="flex flex-col items-center animate-in slide-in-from-right duration-700">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-zinc-900 rounded-2xl border-2 border-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              <UserIcon className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mt-4 text-white">{opponent?.userName.split(" ")[0]}</h3>
          </div>
        </div>
        <p className="mt-16 text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Prepare for Battle</p>
      </div>
    );
  }
  if (battleState === "GAME_OVER") {
    const isWinner = winner === currentUser.id;
    const isTie = winner === null;

    return (
      <div className="flex-1 flex flex-col items-center p-6 md:p-12 overflow-y-auto w-full bg-zinc-950 relative">
        {isWinner && <Confetti />}
        
        <div className={`p-6 rounded-full mb-8 ${isWinner ? 'bg-amber-500/20 text-amber-500' : isTie ? 'bg-zinc-800 text-zinc-400' : 'bg-red-500/20 text-red-500'} animate-in zoom-in duration-500 relative z-10`}>
          {isWinner ? <Swords className="w-16 h-16" /> : isTie ? <UserIcon className="w-16 h-16" /> : <XCircle className="w-16 h-16" />}
        </div>
        
        <h1 className="text-5xl font-black mb-4 text-white uppercase italic tracking-tighter relative z-10">
          {isWinner ? "Victory Royale" : isTie ? "Deadlock" : "Humiliated"}
        </h1>

        <div className="w-full max-w-2xl mb-12 relative z-10">
           <SavageFeedback 
             scorePercent={Math.round((finalScores.me / (questions.length * 100)) * 100)} 
             accuracy={Math.round((finalScores.me / (questions.length * 100)) * 100)} // Mocking accuracy from score for now
             subject="Battle Mode" 
             streak={currentUser.streak} 
             name={currentUser.name} 
           />
        </div>

        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mb-8 relative z-10">
          {isWinner ? "+500 XP / +100 Coins Earned" : "You were just a warm-up for them."}
        </p>

        <Button onClick={() => router.push("/dashboard")} className="bg-white text-black hover:bg-zinc-200 h-16 px-12 text-lg font-black rounded-2xl shadow-xl shadow-white/5 active:scale-95 transition-all relative z-10">
          EXIT ARENA
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="flex-1 flex flex-col bg-zinc-950">
      {/* Versus HUD Header */}
      <header className="px-4 py-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">

        {/* Player 1 Score */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-violet-400 font-bold uppercase">{currentUser.name.split(" ")[0]}</p>
            <p className="text-xl font-black text-white leading-none">{myScore}</p>
          </div>
        </div>

        {/* Timer Center */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-zinc-500 font-bold tracking-widest uppercase mb-1">Time</span>
          <div className={`flex items-center justify-center w-16 h-10 rounded-full font-black text-xl border ${timeLeft <= 5 ? "bg-red-500/10 text-red-500 border-red-500/50 animate-pulse" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"}`}>
            {timeLeft}
          </div>
        </div>

        {/* Opponent Score */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-xs text-red-400 font-bold uppercase">{opponent?.userName.split(" ")[0]}</p>
            <p className="text-xl font-black text-white leading-none">{oppScore}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 flex w-full">
        <div className="h-full bg-violet-500 transition-all duration-300" style={{ width: `${((currentQIndex) / questions.length) * 100}%` }} />
      </div>

      <main className="flex-1 p-4 flex items-center justify-center overflow-y-auto w-full">
        <Card className="w-full max-w-3xl bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardContent className="p-6 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-8 text-white">
              {currentQ?.text}
            </h2>

            <div className="grid gap-3 sm:gap-4">
              {currentQ?.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNext(idx)}
                  className="w-full text-left p-4 sm:p-5 rounded-xl border border-zinc-700 bg-zinc-800/50 hover:bg-violet-600/20 hover:border-violet-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all group flex justify-between items-center"
                >
                  <span className="text-lg font-medium text-zinc-200 group-hover:text-white">{opt}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-zinc-600 group-hover:border-violet-400 flex items-center justify-center">
                    <div className="w-3 h-3 bg-violet-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
