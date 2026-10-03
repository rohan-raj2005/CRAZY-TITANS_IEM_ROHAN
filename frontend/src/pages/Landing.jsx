import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Cpu,
  Sparkles,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Layers,
  CheckCircle2,
  TrendingUp,
  Clock,
  Compass
} from 'lucide-react';
import ActivityTimeline from '../components/ActivityTimeline';

const Landing = () => {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              Neural Intelligence for Academic Behavior
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]"
          >
            STUDY PULSE
            <span className="block mt-3 text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Understand Academic Behavior.
              <br className="hidden sm:block" /> Detect Procrastination Before It Becomes a Pattern.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            STUDY PULSE uses machine learning to analyze academic behavior and identify patterns associated with procrastination. Built with 5-fold cross-validated ensembles, zero-leakage preprocessors, and explainable AI insights.
          </motion.p>

          {/* Action CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/predict"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm tracking-wide transition-all shadow-xl shadow-cyan-500/25 hover:scale-[1.02]"
            >
              <Zap className="w-5 h-5" /> Analyze Student
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/analytics"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm tracking-wide transition-all hover:border-cyan-500/50 backdrop-blur-xl"
            >
              <BarChart3 className="w-5 h-5 text-cyan-400" /> Explore Analytics
            </Link>
          </motion.div>

          {/* Key Stat Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
              <span className="block text-2xl sm:text-3xl font-black font-mono text-cyan-400">451</span>
              <span className="text-xs text-slate-400 mt-0.5 block">Surveyed Student Profiles</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
              <span className="block text-2xl sm:text-3xl font-black font-mono text-purple-400">92.8%</span>
              <span className="text-xs text-slate-400 mt-0.5 block">XGBoost F1-Score (5-Fold)</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
              <span className="block text-2xl sm:text-3xl font-black font-mono text-emerald-400">0.963</span>
              <span className="text-xs text-slate-400 mt-0.5 block">ROC-AUC Discrimination</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
              <span className="block text-2xl sm:text-3xl font-black font-mono text-amber-400">100%</span>
              <span className="text-xs text-slate-400 mt-0.5 block">Leakage-Free Validation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
            Core Technological Innovations
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            Engineered for Precision & Behavioral Insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl hover:border-cyan-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Tri-Model Ensemble</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Trained on Logistic Regression, Random Forest, and XGBoost Decision Trees with 5-Fold Stratified Cross-Validation.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl hover:border-purple-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Explainable AI (XAI)</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Calculates feature impact without causal bias to provide students and advisors transparent insights on contributing habits.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl hover:border-emerald-500/40 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Ethical Risk Indicator</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Designed strictly as an academic advisory indicator to empower time management rather than a clinical label.
            </p>
          </div>
        </div>
      </section>

      {/* Behavioral Anatomy Timeline Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ActivityTimeline />
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <h3 className="text-2xl sm:text-4xl font-black text-white">
            Ready to Analyze Academic Behavior?
          </h3>
          <p className="mt-3 text-sm text-slate-300 max-w-xl mx-auto font-light">
            Launch the STUDY PULSE prediction wizard to compute risk scores, extract key drivers, and examine tailored academic recommendations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/predict"
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20"
            >
              Start Analysis Wizard
            </Link>
            <Link
              to="/models"
              className="px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-sm tracking-wide transition-all"
            >
              View Model Benchmark Data
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
