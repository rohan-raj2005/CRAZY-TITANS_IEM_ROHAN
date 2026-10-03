import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Eye,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  BookOpen,
  Sliders,
  Download,
  Activity
} from 'lucide-react';
import { getStudentHistory } from '../services/api';
import RiskGauge from '../components/RiskGauge';

const StudentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await getStudentHistory(50);
        if (res && res.data) {
          setHistory(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error('Failed to fetch student history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) => {
    const riskTier = item.prediction?.riskTier || item.prediction?.riskLevel || 'LOW';
    const matchesSearch =
      item.id?.toLowerCase().includes(search.toLowerCase()) ||
      item.studentInput?.study_year?.toLowerCase().includes(search.toLowerCase()) ||
      item.modelUsed?.toLowerCase().includes(search.toLowerCase());

    const matchesRisk =
      filterRisk === 'ALL' || riskTier.toUpperCase().includes(filterRisk);

    return matchesSearch && matchesRisk;
  });

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `studypulse_student_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Activity className="w-4 h-4" /> STUDY PULSE Behavioral Records
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Student Assessment History
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Auditable logs of AI behavioral evaluations, contributing factors, and timestamps.
            </p>
          </div>

          <button
            onClick={exportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" /> Export JSON Logs
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, academic year, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none backdrop-blur-md"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          {['ALL', 'HIGH', 'MODERATE', 'LOW'].map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterRisk === risk
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-mono">
            Loading assessment logs...
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Session ID</th>
                  <th className="py-4 px-4">Academic Year</th>
                  <th className="py-4 px-4 text-center">CGPA / Study Hours</th>
                  <th className="py-4 px-4">Submission Timing</th>
                  <th className="py-4 px-4 text-center">Risk Score</th>
                  <th className="py-4 px-4 text-center">Category</th>
                  <th className="py-4 px-4">Model</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {filteredHistory.map((item) => {
                  const itemKey = item.id || item._id || item.recordId || `item-${Math.random()}`;
                  const displayId = String(itemKey).slice(0, 10);
                  const prob = Math.round((item.probability ?? item.prediction?.probability ?? 0.5) * 100);
                  const isHigh = prob >= 70;
                  const isMod = prob >= 40 && prob < 70;
                  const category = item.riskTier || item.riskLevel || item.prediction?.riskTier || item.prediction?.riskLevel || (isHigh ? 'High Risk' : isMod ? 'Moderate Risk' : 'Low Risk');

                  return (
                    <tr key={itemKey} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 text-cyan-400 font-bold">
                        {displayId}...
                      </td>
                      <td className="py-4 px-4 font-sans text-slate-200">
                        {item.studentInput?.study_year || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-center font-sans text-slate-300">
                        {item.studentInput?.cgpa || '7.0'} / {item.studentInput?.weekly_study_hours || item.studentInput?.study_hours_per_week || '10'}h
                      </td>
                      <td className="py-4 px-4 font-sans text-slate-400">
                        {item.studentInput?.assignment_submission_timing || 'Deadline Day'}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-white">
                        {prob}%
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider ${
                          isHigh ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          isMod ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {category}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-sans text-purple-300">
                        {item.modelUsed || 'XGBoost'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedStudent(item)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 transition-colors"
                          title="View Full Diagnostic"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs font-mono">
            No matching assessment logs found. Launch the prediction wizard to generate an assessment.
          </div>
        )}
      </div>

      {/* Modal / Drawer for Inspection */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                    Session ID: {selectedStudent.id}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Student Behavioral Diagnostic
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Gauge & Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <RiskGauge
                  probability={selectedStudent.prediction?.probability || 0}
                  riskLevel={selectedStudent.prediction?.riskTier || selectedStudent.prediction?.riskLevel || 'Low'}
                  confidence={Math.max(selectedStudent.prediction?.probability || 0.5, 1 - (selectedStudent.prediction?.probability || 0.5))}
                />

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Academic Year & CGPA</span>
                    <strong className="text-slate-200">{selectedStudent.studentInput?.study_year} • CGPA {selectedStudent.studentInput?.cgpa}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Weekly Study Hours</span>
                    <strong className="text-slate-200">{selectedStudent.studentInput?.weekly_study_hours || selectedStudent.studentInput?.study_hours_per_week} hrs/week</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Submission Habit</span>
                    <strong className="text-slate-200">{selectedStudent.studentInput?.assignment_submission_timing}</strong>
                  </div>
                </div>
              </div>

              {/* Explanations */}
              {selectedStudent.prediction?.explanation?.featureImpacts && selectedStudent.prediction.explanation.featureImpacts.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-white mb-2">Contributing Factors:</h4>
                  <div className="space-y-2">
                    {selectedStudent.prediction.explanation.featureImpacts.map((exp, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs flex justify-between items-center">
                        <span className="text-slate-300">{exp.feature}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300">
                          {exp.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentHistory;
