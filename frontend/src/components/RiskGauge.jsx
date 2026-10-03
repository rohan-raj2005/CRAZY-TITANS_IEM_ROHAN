import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

const RiskGauge = ({ probability = 0, riskLevel = 'Low', confidence = 0 }) => {
  const percentage = Math.round(probability * 100);
  const radius = 80;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getRiskDetails = () => {
    if (percentage >= 70) {
      return {
        color: '#f43f5e',
        glow: 'rgba(244, 63, 94, 0.4)',
        border: 'border-rose-500/40',
        bg: 'from-rose-500/10 to-red-950/20',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        icon: AlertTriangle,
        label: 'HIGH RISK'
      };
    } else if (percentage >= 40) {
      return {
        color: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.4)',
        border: 'border-amber-500/40',
        bg: 'from-amber-500/10 to-yellow-950/20',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: AlertCircle,
        label: 'MODERATE RISK'
      };
    } else {
      return {
        color: '#10b981',
        glow: 'rgba(16, 185, 129, 0.4)',
        border: 'border-emerald-500/40',
        bg: 'from-emerald-500/10 to-emerald-950/20',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: CheckCircle2,
        label: 'LOW RISK'
      };
    }
  };

  const details = getRiskDetails();
  const Icon = details.icon;

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border bg-gradient-to-b ${details.bg} ${details.border} backdrop-blur-xl transition-all duration-500 shadow-2xl`}>
      {/* Glow Halo */}
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: details.color }}
      />

      {/* SVG Radial Gauge */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg
          height={radius * 2 + 20}
          width={radius * 2 + 20}
          className="rotate-[-90deg] transform"
        >
          {/* Background Track */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius + 10}
            cy={radius + 10}
            strokeDasharray="4 4"
          />
          {/* Animated Value Arc */}
          <motion.circle
            stroke={details.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            r={normalizedRadius}
            cx={radius + 10}
            cy={radius + 10}
            style={{
              filter: `drop-shadow(0 0 10px ${details.glow})`
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl sm:text-5xl font-black font-mono tracking-tighter text-white"
          >
            {percentage}%
          </motion.span>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {/* Badge & Level */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 flex flex-col items-center gap-2"
      >
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase ${details.badge}`}>
          <Icon className="w-4 h-4" />
          <span>{details.label}</span>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
          <span>Confidence: <strong className="text-slate-200">{(confidence * 100).toFixed(1)}%</strong></span>
          <span>•</span>
          <span>Category: <strong className="text-slate-200">{riskLevel}</strong></span>
        </div>
      </motion.div>
    </div>
  );
};

export default RiskGauge;
