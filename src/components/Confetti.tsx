"use client";

import { useEffect, useState } from "react";

export default function Confetti() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 2 + 3,
      rotate: Math.random() * 360,
      color: ["#f59e0b", "#d946ef", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 4)],
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-[-10%]"
          style={{
            left: `${p.left}%`,
            width: "10px",
            height: "10px",
            backgroundColor: p.color,
            transform: `scale(${p.scale}) rotate(${p.rotate}deg)`,
            opacity: 0.8,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
