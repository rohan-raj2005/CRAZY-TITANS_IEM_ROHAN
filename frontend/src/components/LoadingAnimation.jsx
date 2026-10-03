import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Cpu, Database, Sparkles, CheckCircle2, Activity } from 'lucide-react';

const stages = [
  { id: 1, text: 'Collecting academic & behavioral signals...', icon: Database },
  { id: 2, text: 'Analyzing study habits & distraction profiles...', icon: Brain },
  { id: 3, text: 'Executing 5-Fold trained ML ensembles...', icon: Cpu },
  { id: 4, text: 'Computing feature-level explanations (XAI)...', icon: Sparkles },
  { id: 5, text: 'Preparing STUDY PULSE behavioral risk insight...', icon: CheckCircle2 }
];

const LoadingAnimation = ({ active = true }) => {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 600);

    return () => clearInterval(interval);
  }, [active]);

  const CurrentIcon = stages[currentStage].icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background Neural Glow */}
      <div className="absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-10" />

      {/* Pulsing Core Icon */}
      <div className="relative mb-8">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-24 h-24 rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)] backdrop-blur-md"
        >
          <CurrentIcon className="w-12 h-12 text-cyan-400" />
        </motion.div>

        {/* Outer orbital rings */}
        <div className="absolute -inset-3 border border-cyan-500/20 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute -inset-6 border border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
        Analyzing Academic Behavior...
      </h3>
      <p className="text-xs text-slate-400 font-mono mt-1">STUDY PULSE Inference Engine v1.0</p>

      {/* Multi-stage Progress Indicators */}
      <div className="mt-8 w-full max-w-md space-y-3">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                isCurrent
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow-md shadow-cyan-500/10'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
                  : 'border-slate-800/60 bg-slate-950/40 text-slate-500'
              }`}
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-current font-mono text-[10px]">
                {isDone ? '✓' : idx + 1}
              </div>
              <span className="font-medium flex-1 text-left">{stage.text}</span>
              {isCurrent && (
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingAnimation;
