const { parseDataset, REASON_MAPPINGS } = require('../../ml/preprocessing/preprocessor');
const config = require('../config/config');
const studentRepo = require('../models/Student');

let cachedAnalytics = null;

async function computeAnalytics() {
  if (cachedAnalytics) return cachedAnalytics;

  const records = await parseDataset(config.DATASET_PATH);
  const total = records.length;

  // 1. Procrastination distribution
  const procCount = records.filter(r => r.target === 1).length;
  const nonProcCount = total - procCount;

  const procrastinationDistribution = [
    { name: 'Procrastinators', value: procCount, percentage: parseFloat(((procCount / total) * 100).toFixed(1)), fill: '#f43f5e' },
    { name: 'Non-Procrastinators', value: nonProcCount, percentage: parseFloat(((nonProcCount / total) * 100).toFixed(1)), fill: '#10b981' }
  ];

  // Helper for cross tabulations
  const crossTab = (field, allowedOrder) => {
    const counts = {};
    for (const r of records) {
      const val = r.features[field] || 'Unknown';
      if (!counts[val]) {
        counts[val] = { category: val, Procrastinators: 0, 'Non-Procrastinators': 0, total: 0 };
      }
      if (r.target === 1) counts[val].Procrastinators++;
      else counts[val]['Non-Procrastinators']++;
      counts[val].total++;
    }

    let arr = Object.values(counts);
    if (allowedOrder) {
      arr.sort((a, b) => {
        const iA = allowedOrder.indexOf(a.category);
        const iB = allowedOrder.indexOf(b.category);
        return (iA === -1 ? 999 : iA) - (iB === -1 ? 999 : iB);
      });
    }
    return arr;
  };

  // 2. Study hours vs procrastination
  const studyHoursOrder = ['0-5 hours', '6-10 hours', '11-15 hours', '16+ hours'];
  const studyHoursData = crossTab('study_hours_per_week', studyHoursOrder);

  // 3. CGPA vs procrastination
  const cgpaOrder = ['Below 2.50', '2.50 - 2.99', '3.00 - 3.49', '3.50 - 3.74', '3.75 - 4.00'];
  const cgpaData = crossTab('cgpa', cgpaOrder).map(item => ({
    bracket: item.category,
    total: item.total,
    procrastinators: item.Procrastinators,
    rate: item.total ? item.Procrastinators / item.total : 0
  }));

  // 4. Mobile screen time vs procrastination
  const mobileOrder = ['1-2 hours', '3-4 hours', 'More than 4 hours'];
  const mobileUsageData = crossTab('hours_spent_on_mobile_non_academic', mobileOrder).map(item => ({
    category: item.category,
    total: item.total,
    procrastinators: item.Procrastinators,
    procrastinationRate: item.total ? item.Procrastinators / item.total : 0
  }));

  // 5. Stress vs procrastination
  const stressOrder = ['Not at all', 'Slightly', 'Moderately', 'Significantly'];
  const stressData = crossTab('stress_due_to_procrastination', stressOrder).map(item => ({
    level: item.category,
    total: item.total,
    procrastinators: item.Procrastinators,
    procrastinationRate: item.total ? item.Procrastinators / item.total : 0
  }));

  // 6. Assignment submission timing distribution
  const timingOrder = ['Never', 'Occasionally', 'Sometimes', 'Often', 'Always'];
  const assignmentTimingData = crossTab('assignment_submission_timing', timingOrder).map(item => ({
    timing: item.category,
    count: item.total,
    procrastinators: item.Procrastinators,
    procrastinationRate: item.total ? item.Procrastinators / item.total : 0
  }));

  // 7. Reasons breakdown
  const reasonNames = {
    reason_distractions: 'Social Media / Distraction',
    reason_poor_time_management: 'Poor Time Management',
    reason_stress_anxiety: 'Stress & Anxiety',
    reason_lack_of_interest: 'Lack of Interest',
    reason_lack_of_resources: 'Lack of Resources',
    reason_health_issues: 'Health Issues',
    reason_unclear_instructions: 'Unclear Instructions',
    reason_personal_family_problems: 'Personal / Family Problems',
    reason_overconfidence: 'Overconfidence'
  };

  const reasonsBreakdown = Object.keys(REASON_MAPPINGS).map(reasonKey => {
    let procYes = 0;
    let nonProcYes = 0;
    for (const r of records) {
      if (r.features[reasonKey] === 1) {
        if (r.target === 1) procYes++;
        else nonProcYes++;
      }
    }
    const tot = procYes + nonProcYes;
    return {
      reason: reasonNames[reasonKey] || reasonKey,
      rawKey: reasonKey,
      procrastinators: parseFloat(((procYes / (procCount || 1)) * 100).toFixed(1)),
      nonProcrastinators: parseFloat(((nonProcYes / (nonProcCount || 1)) * 100).toFixed(1)),
      procrastinationRate: tot ? procYes / tot : 0,
      count: tot
    };
  }).sort((a, b) => b.count - a.count);

  // Compute average study hours
  let procStudySum = 0;
  let nonProcStudySum = 0;
  for (const r of records) {
    const val = r.features['study_hours_per_week'];
    const h = val === '0-5 hours' ? 3 : val === '6-10 hours' ? 8 : val === '11-15 hours' ? 13 : 18;
    if (r.target === 1) procStudySum += h;
    else nonProcStudySum += h;
  }

  const overallAvg = parseFloat(((procStudySum + nonProcStudySum) / total).toFixed(1));
  const procAvg = parseFloat((procStudySum / (procCount || 1)).toFixed(1));
  const nonProcAvg = parseFloat((nonProcStudySum / (nonProcCount || 1)).toFixed(1));

  cachedAnalytics = {
    totalStudents: total,
    totalResponses: total,
    procrastinationRate: parseFloat(((procCount / total) * 100).toFixed(1)),
    summary: {
      totalResponses: total,
      totalStudents: total,
      procrastinationRate: parseFloat(((procCount / total) * 100).toFixed(1)),
      procrastinatorsCount: procCount,
      nonProcrastinatorsCount: nonProcCount,
      averageStudyHours: overallAvg
    },
    distribution: {
      procrastinators: procCount,
      nonProcrastinators: nonProcCount
    },
    procrastinationDistribution,
    studyHoursAnalysis: {
      overallAverageHours: overallAvg,
      procrastinatorAvgHours: procAvg,
      nonProcrastinatorAvgHours: nonProcAvg,
      distribution: studyHoursData
    },
    studyHoursData,
    cgpaAnalysis: cgpaData,
    cgpaData,
    mobileUsageAnalysis: mobileUsageData,
    mobileUsageData,
    stressAnalysis: stressData,
    stressData,
    timingAnalysis: assignmentTimingData,
    assignmentTimingData,
    reasonsAnalysis: reasonsBreakdown,
    reasonsBreakdown
  };

  return cachedAnalytics;
}

async function getAnalytics(req, res, next) {
  try {
    const analytics = await computeAnalytics();
    const payload = {
      ...analytics,
      livePredictionsCount: studentRepo.count()
    };
    res.status(200).json({
      success: true,
      data: payload,
      analytics: payload
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAnalytics
};
