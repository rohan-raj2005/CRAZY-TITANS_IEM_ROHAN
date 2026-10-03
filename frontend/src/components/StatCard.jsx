import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, subtitle, icon: Icon, change, changeType = 'neutral', glowColor = 'cyan' }) => {
  const glowStyles = {
    cyan: 'from-cyan-500/20 to-blue-500/5 hover:border-cyan-500/40 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    purple: 'from-purple-500/20 to-pink-500/5 hover:border-purple-500/40 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]',
    emerald: 'from-emerald-500/20 to-teal-500/5 hover:border-emerald-500/40 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    amber: 'from-amber-500/20 to-orange-500/5 hover:border-amber-500/40 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    rose: 'from-rose-500/20 to-red-500/5 hover:border-rose-500/40 group-hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]',
  };

  const iconGlow = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative rounded-2xl border border-slate-800/80 bg-gradient-to-br bg-slate-900/70 p-6 backdrop-blur-xl transition-all duration-300 ${glowStyles[glowColor] || glowStyles.cyan}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">{value}</h3>
            {change && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                changeType === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                changeType === 'negative' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                'bg-slate-700/30 text-slate-300 border border-slate-700/40'
              }`}>
                {change}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400/80">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border p-2.5 transition-transform duration-300 group-hover:scale-110 ${iconGlow[glowColor] || iconGlow.cyan}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
};

export default StatCard;
