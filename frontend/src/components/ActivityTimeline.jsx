import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, AlertTriangle, CheckCircle, FileText, Coffee, Zap, ChevronRight } from 'lucide-react';

const defaultSteps = [
  {
    title: 'Assignment Given',
    time: 'Day 1 (2 Weeks to Deadline)',
    desc: 'Task requirements and rubrics published. Initial intention to start early.',
    icon: FileText,
    type: 'normal',
    procrastinatorState: 'Assumes ample time available; files away task notification without review.',
    regulatedState: 'Reviews prompt, creates task breakdown, schedules study blocks.'
  },
  {
    title: 'Dormant Phase (No Activity)',
    time: 'Days 2 - 8 (Midway)',
    desc: 'Days pass without significant progress. Priority shifts to lower-friction immediate rewards.',
    icon: Clock,
    type: 'warning',
    procrastinatorState: 'Active rationalization: "I will work on it this weekend." High phone/social media usage.',
    regulatedState: 'Completes preliminary research and initial outline draft.'
  },
  {
    title: 'Task Re-opened',
    time: 'Day 9 (5 Days Remaining)',
    desc: 'Brief encounter with the assignment materials. Mild cognitive dissonance experienced.',
    icon: Coffee,
    type: 'normal',
    procrastinatorState: 'Browses brief for 10 minutes, feels intimidated by scope, switches back to distractions.',
    regulatedState: 'Drafts first half of assignment, seeks clarification on ambiguous points.'
  },
  {
    title: 'Deadline Approaching',
    time: 'Day 12 (48 Hours Remaining)',
    desc: 'Acute deadline awareness triggers psychological tension and stress response.',
    icon: AlertTriangle,
    type: 'alert',
    procrastinatorState: 'Surge in stress and anxiety. Guilt accumulates over lost preparatory time.',
    regulatedState: 'Refining, proofreading, and cross-checking references.'
  },
  {
    title: 'Last-Minute Frenzy',
    time: 'Day 13-14 (12-2 Hours Remaining)',
    desc: 'High-intensity hyperfocus fueled by panic. Sleep deprivation and elevated cognitive fatigue.',
    icon: Zap,
    type: 'danger',
    procrastinatorState: 'All-night cramming session; shallow synthesis, high vulnerability to errors.',
    regulatedState: 'Polished final review completed ahead of schedule with zero stress.'
  },
  {
    title: 'Submission',
    time: 'Minutes Before Cutoff (or Late)',
    desc: 'Assignment submitted under high strain. Post-submission fatigue and vow to "do better next time".',
    icon: CheckCircle,
    type: 'final',
    procrastinatorState: 'Rushed submission 5 minutes before deadline. Lingering academic fatigue.',
    regulatedState: 'Clean submission submitted 24 hours in advance with peace of mind.'
  }
];

const ActivityTimeline = () => {
  const [activeMode, setActiveMode] = useState('procrastinator'); // 'procrastinator' | 'regulated'

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Academic Behavioral Timeline Anatomy</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing the psychological trajectory of assignment workflow progression
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveMode('procrastinator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'procrastinator'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Procrastination Pattern
          </button>
          <button
            onClick={() => setActiveMode('regulated')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMode === 'regulated'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Regulated Study Flow
          </button>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {defaultSteps.map((step, idx) => {
          const Icon = step.icon;
          const isPro = activeMode === 'procrastinator';

          const colorClasses = isPro
            ? step.type === 'danger'
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
              : step.type === 'alert'
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
              : 'border-slate-700 bg-slate-800 text-slate-300'
            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]';

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Node Point */}
              <div className={`absolute -left-[35px] sm:-left-[43px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-slate-950 transition-transform group-hover:scale-110 ${colorClasses}`}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Card */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5 hover:border-slate-700 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">Step 0{idx + 1}</span>
                    <h4 className="text-base font-bold text-white">{step.title}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{step.time}</span>
                </div>

                <p className="mt-1 text-xs text-slate-400">{step.desc}</p>

                {/* Behavioral State Box */}
                <div className={`mt-3 p-3 rounded-xl border text-xs leading-relaxed ${
                  isPro
                    ? 'border-rose-500/20 bg-rose-950/20 text-rose-200'
                    : 'border-emerald-500/20 bg-emerald-950/20 text-emerald-200'
                }`}>
                  <strong className="block text-[11px] uppercase font-bold tracking-wider mb-0.5 opacity-80">
                    {isPro ? '⚠️ Procrastination Trait' : '✨ Self-Regulated Trait'}
                  </strong>
                  {isPro ? step.procrastinatorState : step.regulatedState}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTimeline;
