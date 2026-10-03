import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, ShieldAlert, Sparkles, CheckCircle, ArrowRight, Activity, Info, BarChart3, ShieldCheck } from 'lucide-react';
import RiskGauge from './RiskGauge';

const PredictionCard = ({ result, studentInput, onReset, onNavigateAnalytics }) => {
  if (!result || !result.prediction) return null;

  const rawPred = result.prediction;
  const probability = rawPred.probability !== undefined ? rawPred.probability : (rawPred.confidence || 0.5);
  const riskLevel = rawPred.riskTier || rawPred.riskLevel || (probability >= 0.7 ? 'High Risk' : probability >= 0.4 ? 'Moderate Risk' : 'Low Risk');
  const isProcrastinator = rawPred.predictedClass === 1 || probability >= 0.5;
  const modelUsed = rawPred.modelUsed || result.modelUsed || 'STUDY PULSE Engine';
  const label = rawPred.label || (isProcrastinator ? 'Procrastination Pattern Detected' : 'No Significant Pattern Detected');

  // Extract explanation elements
  const explObj = rawPred.explanation || result.explanation || {};
  const featureImpacts = Array.isArray(explObj) ? explObj : (explObj.featureImpacts || []);
  const riskDrivers = explObj.riskDrivers || [];
  const protectiveFactors = explObj.protectiveFactors || [];
  const recommendations = explObj.recommendations || result.recommendations || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
                Inference Complete • {modelUsed}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-cyan-400" />
              Behavioral Pattern Analysis Result
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              STUDY PULSE has evaluated academic behavior traits against 451 student benchmarks using supervised machine learning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 transition-colors"
            >
              Analyze Another Student
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Risk Gauge + Prediction Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Risk Gauge */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <RiskGauge
            probability={probability}
            riskLevel={riskLevel}
            confidence={Math.max(probability, 1 - probability)}
          />

          {/* Model Status Card */}
          <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" /> Active Classifier
              </span>
              <span className="font-mono text-slate-200 font-semibold">{modelUsed}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Observed Class</span>
              <span className="font-mono text-cyan-300 font-semibold">{label}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Insight & Contributing Factors */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary Card */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Observed Behavioral Pattern
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {isProcrastinator
                ? `Student profile exhibits alignment with observed academic delay indicators (Estimated Probability ${(probability * 100).toFixed(1)}%). Core contributing factors include task postponement habits, last-minute preparation friction, and vulnerability to digital distractions.`
                : `Student profile exhibits structured self-regulation patterns with low likelihood of chronic assignment delay (Risk Score ${(probability * 100).toFixed(1)}%). Core positive indicators include proactive task initiation and structured study habits.`}
            </p>

            {/* Qualitative Drivers & Protective Highlights */}
            <div className="mt-4 space-y-2">
              {riskDrivers.map((driver, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  <span className="font-bold font-mono">⚠️ Driver:</span>
                  <span>{driver}</span>
                </div>
              ))}
              {protectiveFactors.map((prot, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl">
                  <span className="font-bold font-mono">✨ Protective:</span>
                  <span>{prot}</span>
                </div>
              ))}
            </div>

            {/* Non-medical Disclaimer */}
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-blue-500/20 bg-blue-950/20 p-3 text-xs text-blue-300">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Ethical Note:</strong> This output represents a behavioral risk indicator derived from empirical survey data for academic advisory support, not a clinical or psychological diagnosis.
              </span>
            </div>
          </div>

          {/* Contributing Factors Breakdown (Explainable AI) */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 backdrop-blur-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Why STUDY PULSE Detected This Pattern (Feature Influence Breakdown)
            </h3>

            <div className="space-y-3">
              {featureImpacts.length > 0 ? (
                featureImpacts.map((item, idx) => {
                  const impactText = item.impact || (item.weight > 0 ? 'High impact' : 'Protective');
                  const isProtective = impactText.toLowerCase().includes('protect') || (item.weight && item.weight < 0);
                  const isRisk = impactText.toLowerCase().includes('risk') || (item.weight && item.weight > 0.5);

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 font-mono text-xs font-bold text-slate-300">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">{item.feature}</p>
                          <p className="text-xs text-slate-400">Contributed to model decision boundary</p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                        isProtective
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : isRisk
                          ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                          : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                      }`}>
                        {impactText}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400">Standard baseline distribution across study patterns.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Targeted Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Suggested Academic Support Interventions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">Intervention #{idx + 1}</span>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PredictionCard;
