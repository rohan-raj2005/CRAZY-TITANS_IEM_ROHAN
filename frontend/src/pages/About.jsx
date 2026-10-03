import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  BookOpen,
  Code2,
  Database,
  CheckCircle2,
  Sparkles,
  Info,
  Activity
} from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
          <Activity className="w-4 h-4" /> System Philosophy & Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white mt-2">
          About STUDY PULSE
        </h1>
        <p className="text-base text-slate-300 mt-2 max-w-3xl font-light leading-relaxed">
          AI-Based Academic Procrastination Pattern Detection System engineered for early behavioral pattern identification and structured self-regulation advisory.
        </p>
      </div>

      {/* Problem Statement & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">The Academic Problem</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Academic procrastination affects over 70% of university students worldwide, leading to chronic deadline distress, sleep disruption, and compromised educational outcomes. Traditional academic interventions often occur retroactively after grades slip, rather than detecting early behavioral friction.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">The STUDY PULSE Solution</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            STUDY PULSE bridges behavioral analytics and machine learning. By evaluating multidimensional habits (submission timing, distraction susceptibility, time-management tool utilization), STUDY PULSE classifies delay patterns and computes transparent factor contributions to guide personalized interventions.
          </p>
        </div>
      </div>

      {/* Machine Learning Pipeline Specifications */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-cyan-400" />
          Rigorous Machine Learning Pipeline
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-xs font-mono font-bold text-cyan-400 block uppercase">01. Target Formation</span>
            <p className="text-xs text-slate-300 mt-1">
              Mapped from <code>assignment_delay_frequency</code> (Always/Often = 1, Others = 0). Target dropped from inputs.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-xs font-mono font-bold text-purple-400 block uppercase">02. Leakage Prevention</span>
            <p className="text-xs text-slate-300 mt-1">
              Dropped downstream outcome features and fit preprocessing transforms strictly inside 5 training folds.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">03. Tri-Ensemble Models</span>
            <p className="text-xs text-slate-300 mt-1">
              Implemented native JavaScript Logistic Regression, Random Forest, and XGBoost Boosted Trees.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40">
            <span className="text-xs font-mono font-bold text-amber-400 block uppercase">04. Explainable AI</span>
            <p className="text-xs text-slate-300 mt-1">
              Real-time feature attribution highlighting individual habit vectors driving model confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Ethical & Non-Diagnostic Advisory Protocol */}
      <div className="p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 to-slate-900/60 backdrop-blur-xl space-y-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Ethical AI & Non-Diagnostic Disclaimer</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          STUDY PULSE is strictly an <strong>academic behavioral decision support tool</strong>. Outputs represent probabilistic risk indicators derived from empirical student survey responses. The system does not provide psychological, medical, or clinical diagnoses. All terminology uses objective framing ("observed behavioral pattern", "model prediction", "contributing factor") rather than diagnostic labeling.
        </p>
      </div>

      {/* Technology Stack */}
      <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-purple-400" />
          Full-Stack Architectural Implementation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <strong className="text-cyan-400 block uppercase tracking-wider font-mono">Frontend Architecture</strong>
            <ul className="space-y-1.5 text-slate-300">
              <li>• React 18 + Vite (JavaScript SPA)</li>
              <li>• Tailwind CSS Design Tokens</li>
              <li>• Framer Motion Interactive Micro-animations</li>
              <li>• Recharts Responsive Data Visualizations</li>
              <li>• Lucide React Iconography</li>
              <li>• Axios Client with Resilient Interceptors</li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-purple-400 block uppercase tracking-wider font-mono">Backend Engine</strong>
            <ul className="space-y-1.5 text-slate-300">
              <li>• Node.js + Express.js REST Framework</li>
              <li>• Modular Layered Architecture (Controllers/Services)</li>
              <li>• Native JS Machine Learning Pipeline</li>
              <li>• Dual-Mode Storage (In-Memory + Optional Mongoose)</li>
              <li>• CORS & Dotenv Security Environment</li>
              <li>• Structured Error Handling Middleware</li>
            </ul>
          </div>

          <div className="space-y-2">
            <strong className="text-emerald-400 block uppercase tracking-wider font-mono">Evaluation & ML Pipeline</strong>
            <ul className="space-y-1.5 text-slate-300">
              <li>• 5-Fold Stratified Cross-Validation</li>
              <li>• Multi-select Procrastination Reason Parsing</li>
              <li>• Accuracy, Precision, Recall, F1, ROC-AUC</li>
              <li>• Out-of-fold Aggregated Confusion Matrix</li>
              <li>• XGBoost, Random Forest, Logistic Reg</li>
              <li>• Zero Data Leakage Guarantees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
