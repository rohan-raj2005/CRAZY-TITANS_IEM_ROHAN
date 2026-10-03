class ExplanationService {
  generateExplanation(featureRow, vector, featureNames, probability, predictedClass) {
    const riskDrivers = [];
    const protectiveFactors = [];
    const featureImpacts = [];

    // Analyze specific academic and study behavioral indicators
    if (featureRow['assignment_submission_timing'] === 'Never' || featureRow['assignment_submission_timing'] === 'Occasionally') {
      riskDrivers.push('Frequent delayed or missed assignment submission patterns');
      featureImpacts.push({ feature: 'Assignment Submission Timing (Delayed)', impact: 'High Risk Driver', weight: 0.85 });
    } else if (featureRow['assignment_submission_timing'] === 'Always' || featureRow['assignment_submission_timing'] === 'Often') {
      protectiveFactors.push('Consistent and punctual assignment submission record');
      featureImpacts.push({ feature: 'Assignment Submission Timing (Punctual)', impact: 'Strong Protective Factor', weight: -0.75 });
    }

    if (featureRow['study_hours_per_week'] === '0-5 hours') {
      riskDrivers.push('Low weekly dedicated study allocation (0-5 hours/week)');
      featureImpacts.push({ feature: 'Low Study Volume (0-5 hrs/wk)', impact: 'Moderate Risk Driver', weight: 0.65 });
    } else if (featureRow['study_hours_per_week'] === '11-15 hours' || featureRow['study_hours_per_week'] === '16+ hours') {
      protectiveFactors.push('Substantial structured study investment (>10 hours/week)');
      featureImpacts.push({ feature: 'High Study Volume (10+ hrs/wk)', impact: 'Protective Factor', weight: -0.60 });
    }

    if (featureRow['last_minute_exam_preparation'] === 'Yes') {
      riskDrivers.push('Predominance of last-minute exam preparation and cramming');
      featureImpacts.push({ feature: 'Last-Minute Exam Preparation', impact: 'High Risk Driver', weight: 0.70 });
    } else if (featureRow['last_minute_exam_preparation'] === 'No') {
      protectiveFactors.push('Early revision and systematic exam readiness');
      featureImpacts.push({ feature: 'Structured Early Revision', impact: 'Protective Factor', weight: -0.50 });
    }

    if (featureRow['hours_spent_on_mobile_non_academic'] === 'More than 4 hours') {
      riskDrivers.push('Elevated non-academic screen time (>4 hours/day)');
      featureImpacts.push({ feature: 'Excessive Mobile Usage (>4 hrs/day)', impact: 'Moderate Risk Driver', weight: 0.55 });
    }

    if (featureRow['use_of_time_management'] === 'Never' || featureRow['use_of_time_management'] === 'Occasionally') {
      riskDrivers.push('Infrequent use of structured time-management frameworks');
      featureImpacts.push({ feature: 'Low Time-Management Usage', impact: 'Moderate Risk Driver', weight: 0.50 });
    } else if (featureRow['use_of_time_management'] === 'Always' || featureRow['use_of_time_management'] === 'Often') {
      protectiveFactors.push('Active application of time-management techniques');
      featureImpacts.push({ feature: 'Consistent Time Management', impact: 'Protective Factor', weight: -0.65 });
    }

    if (featureRow['study_session_distractions'] === 'Always' || featureRow['study_session_distractions'] === 'Often') {
      riskDrivers.push('High frequency of environmental or digital distraction during study blocks');
      featureImpacts.push({ feature: 'Frequent Study Distractions', impact: 'Moderate Risk Driver', weight: 0.50 });
    }

    // Reasons analysis
    if (featureRow['reason_poor_time_management'] === 1) {
      riskDrivers.push('Self-reported challenges in managing study schedules');
      featureImpacts.push({ feature: 'Reason: Poor Time Management', impact: 'Self-Reported Factor', weight: 0.45 });
    }
    if (featureRow['reason_distractions'] === 1) {
      riskDrivers.push('Self-reported vulnerability to social media and digital interruptions');
      featureImpacts.push({ feature: 'Reason: Social Media Distraction', impact: 'Self-Reported Factor', weight: 0.40 });
    }
    if (featureRow['reason_lack_of_interest'] === 1) {
      riskDrivers.push('Decreased intrinsic academic interest in course subjects');
      featureImpacts.push({ feature: 'Reason: Lack of Subject Interest', impact: 'Self-Reported Factor', weight: 0.40 });
    }
    if (featureRow['reason_stress_anxiety'] === 1) {
      riskDrivers.push('Academic stress and task-related anxiety');
      featureImpacts.push({ feature: 'Reason: Stress & Anxiety', impact: 'Self-Reported Factor', weight: 0.35 });
    }

    // Actionable personalized guidance
    const recommendations = [];
    if (featureRow['last_minute_exam_preparation'] === 'Yes') {
      recommendations.push('Implement spaced repetition calendars and initiate exam prep at least 14 days in advance.');
    }
    if (featureRow['study_hours_per_week'] === '0-5 hours') {
      recommendations.push('Gradually expand weekly study blocks by 45 minutes using Pomodoro cycles.');
    }
    if (featureRow['hours_spent_on_mobile_non_academic'] === 'More than 4 hours') {
      recommendations.push('Establish digital boundaries with focus modes and screen time blockers during study hours.');
    }
    if (featureRow['use_of_time_management'] === 'Never' || featureRow['use_of_time_management'] === 'Occasionally') {
      recommendations.push('Adopt daily task-batching or digital planner workflows in STUDY PULSE.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Maintain current study regularity, proactive goal setting, and weekly self-reflection.');
    }

    let riskTier = 'Low Risk';
    if (probability >= 0.70) {
      riskTier = 'High Risk';
    } else if (probability >= 0.40) {
      riskTier = 'Moderate Risk';
    }

    return {
      riskTier,
      disclaimer: 'This prediction is a probabilistic behavioral risk indicator based on statistical machine learning models. It is intended for academic support and does not constitute a psychological or clinical diagnosis.',
      riskDrivers,
      protectiveFactors,
      featureImpacts: featureImpacts.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)).slice(0, 8),
      recommendations
    };
  }
}

module.exports = new ExplanationService();
