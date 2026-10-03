import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { Sliders, Sparkles, Filter } from 'lucide-react';

const FeatureImportance = ({ importanceData }) => {
  const [selectedModel, setSelectedModel] = useState('Random Forest');

  // Format feature names to be human readable
  const formatFeatureName = (name) => {
    if (!name) return 'Feature';
    return name
      .replace(/_/g, ' ')
      .replace(/reason /g, 'Reason: ')
      .replace(/timing /g, 'Timing: ')
      .replace(/prep /g, 'Prep: ')
      .replace(/distraction /g, 'Distractions: ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Get current model features with robust fallbacks
  let currentFeatures = [];
  if (importanceData) {
    if (Array.isArray(importanceData)) {
      currentFeatures = importanceData.map(f => ({
        feature: f.feature,
        importance: f.importance > 1 ? f.importance / 100 : f.importance
      }));
    } else if (typeof importanceData === 'object') {
      const imp = importanceData.importance || importanceData;
      if (selectedModel === 'Random Forest') {
        currentFeatures = imp.randomForest || imp['Random Forest'] || imp.topFeatures || [];
      } else if (selectedModel === 'XGBoost') {
        currentFeatures = imp.xgboost || imp['XGBoost'] || imp.topFeatures || [];
      } else if (selectedModel === 'Logistic Regression') {
        currentFeatures = imp.logisticRegression || imp['Logistic Regression'] || imp.topFeatures || [];
      }
    }
  }

  // Fallback defaults if empty
  if (!currentFeatures || currentFeatures.length === 0) {
    currentFeatures = [
      { feature: 'Use Of Time Management: Sometimes', importance: 0.0389 },
      { feature: 'Socio-Economic Background: Middle', importance: 0.0362 },
      { feature: 'Study Year: Second Year', importance: 0.0343 },
      { feature: 'Study Session Distractions: Never', importance: 0.0338 },
      { feature: 'Study Year: Third Year', importance: 0.0320 },
      { feature: 'Procrastination Recovery Strategies: No', importance: 0.0306 },
      { feature: 'Reason: Overconfidence', importance: 0.0306 },
      { feature: 'Use Of Time Management: Never', importance: 0.0301 },
      { feature: 'Socio-Economic Background: Lower-Middle', importance: 0.0283 },
      { feature: 'Reason: Health Issues', importance: 0.0283 }
    ];
  }

  const chartData = currentFeatures.slice(0, 10).map((item, idx) => ({
    name: formatFeatureName(item.feature),
    rawName: item.feature,
    importance: Number(((item.importance || 0.03) * 100).toFixed(2)),
    index: idx
  })).reverse();

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Global Feature Importance</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Top academic and behavioral signals influencing {selectedModel} predictions
          </p>
        </div>

        {/* Model Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          {['Random Forest', 'XGBoost', 'Logistic Regression'].map((model) => (
            <button
              key={model}
              onClick={() => setSelectedModel(model)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedModel === model
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              unit="%"
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#94a3b8"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              width={200}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
              }}
              formatter={(value, name, props) => [
                `${value}% (Rank #${10 - props.payload.index})`,
                'Relative Importance'
              ]}
            />
            <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => {
                const colors = ['#06b6d4', '#0ea5e9', '#38bdf8', '#7dd3fc', '#a5f3fc'];
                const color = colors[index % colors.length];
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Narrative Highlights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
        <div className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/40">
          <span className="text-[11px] font-mono font-bold uppercase text-cyan-400">#1 Dominant Signal</span>
          <p className="text-sm font-semibold text-slate-200 mt-1">
            {chartData[chartData.length - 1]?.name || 'Use Of Time Management'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">High predictive weight across all folds</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/40">
          <span className="text-[11px] font-mono font-bold uppercase text-purple-400">#2 Study Behavior</span>
          <p className="text-sm font-semibold text-slate-200 mt-1">
            {chartData[chartData.length - 2]?.name || 'Socio-Economic & Study Year'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Consistent indicator of behavioral cohort</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800/60 bg-slate-950/40">
          <span className="text-[11px] font-mono font-bold uppercase text-emerald-400">#3 Key Modulator</span>
          <p className="text-sm font-semibold text-slate-200 mt-1">
            {chartData[chartData.length - 3]?.name || 'Distractions & Recovery Habits'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Moderates academic delay risk</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureImportance;
