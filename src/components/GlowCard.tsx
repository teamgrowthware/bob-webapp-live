"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "violet" | "amber" | "cyan" | "rose";
  animate?: boolean;
  delay?: number;
}

export default function GlowCard({ 
  children, 
  className, 
  glowColor = "violet", 
  animate = true,
  delay = 0 
}: GlowCardProps) {
  const glowClass = {
    violet: "neon-glow-violet hover:border-violet-500/50",
    amber: "neon-glow-amber hover:border-amber-500/50",
    cyan: "shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/50",
    rose: "shadow-[0_0_30px_rgba(225,29,72,0.15)] hover:border-rose-500/50",
  }[glowColor];

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      whileHover={animate ? { scale: 1.01, translateY: -5 } : {}}
      whileTap={animate ? { scale: 0.98 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: delay }}
      className={cn(
        "glass-card rounded-[32px] overflow-hidden transition-all duration-300",
        glowClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
}
