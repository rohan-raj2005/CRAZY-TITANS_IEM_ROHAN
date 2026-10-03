import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Sliders,
  Smartphone,
  Flame,
  Layers,
  HelpCircle,
  Activity
} from 'lucide-react';

const reasonOptions = [
  { id: 'reason_lack_of_interest', label: 'Lack of Interest / Motivation', desc: 'Subject material feels unengaging or monotonous' },
  { id: 'reason_distractions', label: 'Digital & Social Distractions', desc: 'Social media, gaming, notifications during work' },
  { id: 'reason_poor_time_management', label: 'Poor Time Management', desc: 'Underestimating task duration or lack of planning' },
  { id: 'reason_stress_anxiety', label: 'Stress & Perfectionism Anxiety', desc: 'Fear of failing or produce imperfect output' },
  { id: 'reason_lack_of_resources', label: 'Lack of Academic Resources', desc: 'Missing textbooks, tool access, or workspace' },
  { id: 'reason_health_issues', label: 'Physical or Mental Fatigue', desc: 'Lack of sleep, burnout, or illness' },
  { id: 'reason_unclear_instructions', label: 'Ambiguous Assignment Prompt', desc: 'Unclear grading expectations or requirements' },
  { id: 'reason_personal_family_problems', label: 'Personal / Family Commitments', desc: 'External domestic or relationship pressures' },
  { id: 'reason_overconfidence', label: 'Overconfidence in Deadline Rush', desc: 'Belief that one operates best only under panic' },
];

const StudentInputForm = ({ onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    study_year: '3rd year',
    socio_economic_background: 'Middle',
    cgpa: 7.8,
    weekly_study_hours: 12,
    assignment_submission_timing: 'On the deadline day',
    last_minute_exam_preparation: 'Often',
    time_management_usage: 'Sometimes',
    procrastination_management_training: 'No',
    recovery_strategies: 'Yes',
    mobile_non_academic_usage: '3-4 hours',
    study_session_distractions: 'Moderate',
    stress_due_to_procrastination: 'Often',
    procrastination_reasons: ['reason_distractions', 'reason_poor_time_management'],
    selectedModel: 'XGBoost'
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleReason = (reasonId) => {
    setFormData((prev) => {
      const exists = prev.procrastination_reasons.includes(reasonId);
      return {
        ...prev,
        procrastination_reasons: exists
          ? prev.procrastination_reasons.filter((id) => id !== reasonId)
          : [...prev.procrastination_reasons, reasonId]
      };
    });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, formData.selectedModel);
  };

  const stepTitles = [
    { num: 1, title: 'Academic Profile', icon: GraduationCap },
    { num: 2, title: 'Study Habits', icon: BookOpen },
    { num: 3, title: 'Distraction & Stress', icon: Flame },
    { num: 4, title: 'Review & Predict', icon: Sparkles }
  ];

  const loadPreset = (type) => {
    if (type === 'high') {
      setFormData({
        study_year: '4th year',
        socio_economic_background: 'Low',
        cgpa: 5.2,
        weekly_study_hours: 3,
        assignment_submission_timing: 'After deadline',
        last_minute_exam_preparation: 'Always',
        time_management_usage: 'Never',
        procrastination_management_training: 'No',
        recovery_strategies: 'No',
        mobile_non_academic_usage: '>4 hours',
        study_session_distractions: 'Extreme',
        stress_due_to_procrastination: 'Always',
        procrastination_reasons: ['reason_lack_of_interest', 'reason_distractions', 'reason_poor_time_management', 'reason_stress_anxiety'],
        selectedModel: 'XGBoost'
      });
    } else if (type === 'moderate') {
      setFormData({
        study_year: '2nd year',
        socio_economic_background: 'Middle',
        cgpa: 7.2,
        weekly_study_hours: 8,
        assignment_submission_timing: 'On the deadline day',
        last_minute_exam_preparation: 'Sometimes',
        time_management_usage: 'Sometimes',
        procrastination_management_training: 'No',
        recovery_strategies: 'Yes',
        mobile_non_academic_usage: '3-4 hours',
        study_session_distractions: 'Moderate',
        stress_due_to_procrastination: 'Sometimes',
        procrastination_reasons: ['reason_distractions', 'reason_poor_time_management'],
        selectedModel: 'Logistic Regression'
      });
    } else if (type === 'low') {
      setFormData({
        study_year: '1st year',
        socio_economic_background: 'High',
        cgpa: 9.4,
        weekly_study_hours: 22,
        assignment_submission_timing: 'Well before deadline',
        last_minute_exam_preparation: 'Never',
        time_management_usage: 'Always',
        procrastination_management_training: 'Yes',
        recovery_strategies: 'Yes',
        mobile_non_academic_usage: '<1 hour',
        study_session_distractions: 'Low',
        stress_due_to_procrastination: 'Never',
        procrastination_reasons: [],
        selectedModel: 'XGBoost'
      });
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
            <Activity className="w-4 h-4" /> STUDY PULSE Intelligence Wizard
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Analyze Student Procrastination Risk
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Input behavioral parameters to compute multidimensional procrastination probability.
          </p>
        </div>

        {/* Quick Demo Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Presets:</span>
          <button
            type="button"
            onClick={() => loadPreset('high')}
            className="px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors"
          >
            🔥 High Risk
          </button>
          <button
            type="button"
            onClick={() => loadPreset('moderate')}
            className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-colors"
          >
            🟡 Moderate
          </button>
          <button
            type="button"
            onClick={() => loadPreset('low')}
            className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold transition-colors"
          >
            🟢 Low Risk
          </button>
        </div>
      </div>

      {/* Step Indicator Bar */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
        {stepTitles.map((st) => {
          const Icon = st.icon;
          const isActive = step === st.num;
          const isDone = step > st.num;

          return (
            <button
              key={st.num}
              type="button"
              onClick={() => isDone && setStep(st.num)}
              className={`flex flex-col sm:flex-row items-center gap-2 p-2.5 sm:p-3 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-white shadow-lg shadow-cyan-500/10'
                  : isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300 hover:border-emerald-500/60'
                  : 'border-slate-800 bg-slate-950/40 text-slate-500 opacity-60'
              }`}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                isActive ? 'bg-cyan-500 text-slate-950' : isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {isDone ? '✓' : st.num}
              </div>
              <div className="hidden sm:block">
                <span className="block text-[11px] font-bold tracking-tight">{st.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Wizard Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Academic Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-cyan-400" /> 1. Academic Baseline & Context
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Study Year */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Current Study Year
                  </label>
                  <select
                    value={formData.study_year}
                    onChange={(e) => updateField('study_year', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="1st year">1st Year (Freshman)</option>
                    <option value="2nd year">2nd Year (Sophomore)</option>
                    <option value="3rd year">3rd Year (Junior)</option>
                    <option value="4th year">4th Year (Senior / Final)</option>
                    <option value="Postgraduate">Postgraduate / Masters</option>
                  </select>
                </div>

                {/* Socio-Economic Background */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Socio-Economic Background
                  </label>
                  <select
                    value={formData.socio_economic_background}
                    onChange={(e) => updateField('socio_economic_background', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Low">Low Income Bracket</option>
                    <option value="Middle">Middle Income Bracket</option>
                    <option value="High">High Income Bracket</option>
                  </select>
                </div>

                {/* CGPA Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase text-slate-300">
                      Cumulative GPA / CGPA
                    </label>
                    <span className="font-mono font-bold text-cyan-400 text-sm">{formData.cgpa} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="10.0"
                    step="0.1"
                    value={formData.cgpa}
                    onChange={(e) => updateField('cgpa', parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>3.0</span>
                    <span>6.5 (Avg)</span>
                    <span>10.0</span>
                  </div>
                </div>

                {/* Weekly Study Hours Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase text-slate-300">
                      Weekly Study Hours
                    </label>
                    <span className="font-mono font-bold text-cyan-400 text-sm">{formData.weekly_study_hours} hrs/week</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="45"
                    step="1"
                    value={formData.weekly_study_hours}
                    onChange={(e) => updateField('weekly_study_hours', parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>1 hr</span>
                    <span>20 hrs</span>
                    <span>45 hrs</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Study Habits */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" /> 2. Workflow & Self-Regulation Habits
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Assignment Submission Timing */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Assignment Submission Timing Habit
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {[
                      { val: 'Well before deadline', label: 'Days in Advance' },
                      { val: 'On the deadline day', label: 'Deadline Day' },
                      { val: 'Few hours before deadline', label: 'Few Hours Left' },
                      { val: 'After deadline', label: 'Late / Overdue' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => updateField('assignment_submission_timing', opt.val)}
                        className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                          formData.assignment_submission_timing === opt.val
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <p className="font-bold text-white">{opt.val}</p>
                        <span className="text-[10px] text-slate-400">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Last-Minute Exam Preparation */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Last-Minute Exam Preparation Frequency
                  </label>
                  <select
                    value={formData.last_minute_exam_preparation}
                    onChange={(e) => updateField('last_minute_exam_preparation', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Never">Never (Consistent schedule)</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often (Night before)</option>
                    <option value="Always">Always (Emergency cramming)</option>
                  </select>
                </div>

                {/* Time Management Tool Usage */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Time Management Tool Usage (Calendars/Notion)
                  </label>
                  <select
                    value={formData.time_management_usage}
                    onChange={(e) => updateField('time_management_usage', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Always">Always Structured</option>
                    <option value="Often">Often Used</option>
                    <option value="Sometimes">Occasionally</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Never">Never Used</option>
                  </select>
                </div>

                {/* Training & Recovery toggles */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Received Time Management / Study Skills Training?
                  </label>
                  <div className="flex gap-3">
                    {['Yes', 'No'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('procrastination_management_training', opt)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          formData.procrastination_management_training === opt
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Applies Structured Recovery Strategies?
                  </label>
                  <div className="flex gap-3">
                    {['Yes', 'No'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateField('recovery_strategies', opt)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                          formData.recovery_strategies === opt
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Distractions & Reasons */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" /> 3. Distraction Profiles & Primary Delay Reasons
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mobile Usage */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Daily Non-Academic Mobile Screen Time
                  </label>
                  <select
                    value={formData.mobile_non_academic_usage}
                    onChange={(e) => updateField('mobile_non_academic_usage', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="<1 hour">&lt; 1 Hour / Day</option>
                    <option value="1-2 hours">1 - 2 Hours / Day</option>
                    <option value="2-3 hours">2 - 3 Hours / Day</option>
                    <option value="3-4 hours">3 - 4 Hours / Day</option>
                    <option value=">4 hours">&gt; 4 Hours (High Usage)</option>
                  </select>
                </div>

                {/* Study Distractions */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Study Session Distraction Level
                  </label>
                  <select
                    value={formData.study_session_distractions}
                    onChange={(e) => updateField('study_session_distractions', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Low">Low (Deep Focus)</option>
                    <option value="Moderate">Moderate (Occasional Interruptions)</option>
                    <option value="High">High (Frequent Context Switches)</option>
                    <option value="Extreme">Extreme (Constant Interruptions)</option>
                  </select>
                </div>

                {/* Stress Due to Delay */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-2">
                    Stress Generated by Procrastination
                  </label>
                  <select
                    value={formData.stress_due_to_procrastination}
                    onChange={(e) => updateField('stress_due_to_procrastination', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Never">Never</option>
                    <option value="Rarely">Rarely</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Often">Often</option>
                    <option value="Always">Always (High Psychological Toll)</option>
                  </select>
                </div>
              </div>

              {/* 9 Multi-select Procrastination Reasons */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-3">
                  Reported Contributing Reasons (Select All Applicable)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {reasonOptions.map((reason) => {
                    const isSelected = formData.procrastination_reasons.includes(reason.id);
                    return (
                      <button
                        key={reason.id}
                        type="button"
                        onClick={() => toggleReason(reason.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-rose-500/50 bg-rose-500/10 text-white shadow-md shadow-rose-500/10'
                            : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-bold text-slate-200">{reason.label}</span>
                          <span className={`h-4 w-4 rounded-md border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-rose-500 border-rose-400 text-white' : 'border-slate-700'
                          }`}>
                            {isSelected && '✓'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">{reason.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Review & Model Selection */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> 4. Review Profile & Select Classification Model
              </h3>

              {/* Summary Pill Grid */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Feature Vector Summary
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Academic Year</span>
                    <strong className="text-slate-200">{formData.study_year}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">CGPA / Hours</span>
                    <strong className="text-slate-200">{formData.cgpa} / {formData.weekly_study_hours}h</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Submission Timing</span>
                    <strong className="text-slate-200">{formData.assignment_submission_timing}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Selected Reasons</span>
                    <strong className="text-cyan-400">{formData.procrastination_reasons.length} Active</strong>
                  </div>
                </div>
              </div>

              {/* Model Choice */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-3">
                  Select Machine Learning Model for Inference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: 'XGBoost', desc: 'Gradient Boosted Decision Trees (Optimal F1: 92.8%)', badge: 'Recommended' },
                    { name: 'Random Forest', desc: 'Ensemble Bagging Classifier (ROC-AUC: 96.3%)', badge: 'High Stability' },
                    { name: 'Logistic Regression', desc: 'Linear Generalized Linear Model (Precision: 94.1%)', badge: 'Fast Linear' }
                  ].map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => updateField('selectedModel', m.name)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        formData.selectedModel === m.name
                          ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-lg shadow-cyan-500/20'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{m.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Actions / Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Step
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-black transition-all shadow-xl shadow-cyan-500/25 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Running ML Engine...' : 'Run STUDY PULSE AI Inference'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StudentInputForm;
