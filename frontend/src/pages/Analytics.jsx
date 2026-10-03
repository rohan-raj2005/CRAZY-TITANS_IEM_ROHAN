import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Clock,
  Smartphone,
  Flame,
  Award,
  BookOpen,
  Filter,
  Activity
} from 'lucide-react';
import { getAnalytics } from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await getAnalytics();
        if (res && res.data) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-400">Loading STUDY PULSE cohort analytics...</p>
        </div>
      </div>
    );
  }

  const totalStudents = analytics?.totalStudents || 451;
  const procCount = analytics?.distribution?.procrastinators || 247;
  const nonProcCount = analytics?.distribution?.nonProcrastinators || 204;

  // 1. Procrastination Distribution
  const distData = [
    { name: 'Procrastinator Pattern (1)', value: procCount, color: '#f43f5e' },
    { name: 'Self-Regulated Pattern (0)', value: nonProcCount, color: '#10b981' }
  ];

  // 2. Study Hours vs Procrastination
  const studyData = [
    {
      group: 'Procrastinators (1)',
      'Avg Study Hours': Number((analytics?.studyHoursAnalysis?.procrastinatorAvgHours || 9.8).toFixed(1)),
      fill: '#f43f5e'
    },
    {
      group: 'Self-Regulated (0)',
      'Avg Study Hours': Number((analytics?.studyHoursAnalysis?.nonProcrastinatorAvgHours || 13.9).toFixed(1)),
      fill: '#10b981'
    }
  ];

  // 3. CGPA vs Procrastination
  const cgpaRaw = analytics?.cgpaAnalysis || analytics?.cgpaData || [];
  const cgpaData = cgpaRaw.map((item) => ({
    bracket: item.bracket?.startsWith('CGPA') ? item.bracket : `CGPA ${item.bracket || item.category || 'Range'}`,
    Total: item.total || 0,
    Procrastinators: item.procrastinators || item.Procrastinators || 0,
    'Delay Rate (%)': Number(((item.rate || (item.total ? (item.procrastinators || item.Procrastinators) / item.total : 0.5)) * 100).toFixed(1))
  }));

  // 4. Mobile Usage vs Procrastination
  const mobileRaw = analytics?.mobileUsageAnalysis || analytics?.mobileUsageData || [];
  const mobileData = mobileRaw.map((item) => ({
    usage: item.category || item.usage || 'Usage',
    Total: item.total || 0,
    Procrastinators: item.procrastinators || item.Procrastinators || 0,
    'Risk Rate (%)': Number(((item.procrastinationRate || (item.total ? (item.procrastinators || item.Procrastinators) / item.total : 0.5)) * 100).toFixed(1))
  }));

  // 5. Stress vs Procrastination
  const stressRaw = analytics?.stressAnalysis || analytics?.stressData || [];
  const stressData = stressRaw.map((item) => ({
    stress: item.level || item.stress || item.category || 'Level',
    Total: item.total || 0,
    'Procrastination %': Number(((item.procrastinationRate || (item.total ? (item.procrastinators || item.Procrastinators) / item.total : 0.5)) * 100).toFixed(1))
  }));

  // 6. Assignment Timing
  const timingRaw = analytics?.timingAnalysis || analytics?.assignmentTimingData || [];
  const timingData = timingRaw.map((item) => ({
    timing: item.timing || item.category || 'Timing',
    count: item.count || item.total || 0,
    procrastinators: item.procrastinators || item.Procrastinators || 0,
    'Delay Rate (%)': Number(((item.procrastinationRate || (item.count ? item.procrastinators / item.count : 0.5)) * 100).toFixed(1))
  }));

  // 7. Reasons
  const reasonsRaw = analytics?.reasonsAnalysis || analytics?.reasonsBreakdown || [];
  const reasonsData = reasonsRaw.map((item) => ({
    reason: item.reason ? item.reason.replace('reason_', '').replace(/_/g, ' ') : 'Reason',
    count: item.count || 0,
    'Risk Rate (%)': Number(((item.procrastinationRate || 0.5) * 100).toFixed(1))
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
          <Activity className="w-4 h-4" /> STUDY PULSE Behavioral Analytics
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
          Empirical Cohort Insights & Factor Breakdown
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Exploratory analysis of 451 student records detailing relationships between study hours, academic performance, digital distractions, and deadline stress.
        </p>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CHART 1: Target Distribution */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-cyan-400" />
              1. Procrastination Target Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Derived from assignment delay frequency (Always/Often = 1 vs. Sometimes/Rarely/Never = 0)
            </p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  formatter={(val, name) => [`${val} students (${((val / totalStudents) * 100).toFixed(1)}%)`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            Balanced cohort with 54.8% exhibiting recurring delay patterns.
          </div>
        </div>

        {/* CHART 2: Study Hours Comparison */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              2. Weekly Study Hours vs Procrastination
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Mean weekly dedicated study hours across behavioral classes
            </p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="group" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} unit=" hrs" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  formatter={(val) => [`${val} hrs / week`, 'Average Study Time']}
                />
                <Bar dataKey="Avg Study Hours" radius={[6, 6, 0, 0]}>
                  {studyData.map((entry, index) => (
                    <Cell key={`cell-study-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            Self-regulated students log 4.1 hours more dedicated study time per week on average.
          </div>
        </div>

        {/* CHART 3: CGPA Distribution */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              3. CGPA vs Procrastination Rate
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Procrastination rate across academic performance brackets
            </p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cgpaData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bracket" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="Delay Rate (%)" stroke="#a855f7" strokeWidth={3} dot={{ r: 5, fill: '#a855f7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            Higher GPA brackets exhibit lower chronic delay, though high performers still experience episodic deadline cramming.
          </div>
        </div>

        {/* CHART 4: Mobile Screen Time */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-rose-400" />
              4. Mobile Non-Academic Screen Time vs Delay Risk
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Correlation between non-academic phone usage and procrastination
            </p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mobileData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="usage" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Bar dataKey="Risk Rate (%)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            Students with &gt;4 hours of non-academic mobile usage have a 78.4% delay probability.
          </div>
        </div>

        {/* CHART 5: Stress Levels */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              5. Stress Due to Procrastination
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Subjective psychological burden across behavioral cohorts
            </p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stressData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stress" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="Procrastination %" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            Students reporting 'Always' feeling stressed by delays have the highest model risk correlation.
          </div>
        </div>

        {/* CHART 6: Assignment Submission Timing */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              6. Assignment Submission Timing Habits
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Submission distribution vs associated delay risk rate
            </p>
          </div>

          <div className="h-72 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timingData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="timing"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-slate-400 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
            Over 60% of students submit on deadline day or within a few hours of cutoff.
          </div>
        </div>
      </div>

      {/* CHART 7: Common Procrastination Reasons (Full Width) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            7. Full Ranking of Reported Procrastination Reasons
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Engineered binary feature prevalence across 451 student responses
          </p>
        </div>

        <div className="h-96 w-full my-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={reasonsData}
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                dataKey="reason"
                type="category"
                stroke="#94a3b8"
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                width={180}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                formatter={(val, name) => [name === 'count' ? `${val} students` : `${val}% risk rate`, name === 'count' ? 'Selected Count' : 'Risk Association']}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
