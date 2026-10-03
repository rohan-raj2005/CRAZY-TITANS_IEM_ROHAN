const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const { parseReasonsText, DatasetEncoder, CATEGORICAL_COLUMNS, BINARY_REASON_COLUMNS } = require('../../ml/preprocessing/preprocessor');

class PreprocessingService {
  constructor() {
    this.encoder = null;
    this.init();
  }

  init() {
    try {
      const metaPath = path.join(config.TRAINED_MODELS_DIR, 'metadata.json');
      if (fs.existsSync(metaPath)) {
        const json = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        this.encoder = DatasetEncoder.fromJSON(json);
      }
    } catch (e) {
      console.warn('[PreprocessingService] Metadata not found on startup. Run trainModels.js');
    }
  }

  normalizeStudentInput(raw) {
    const norm = {};

    // 1. Study Year
    const sy = String(raw.study_year || '').toLowerCase();
    if (sy.includes('1') || sy.includes('first')) norm['study_year'] = 'First Year';
    else if (sy.includes('2') || sy.includes('second')) norm['study_year'] = 'Second Year';
    else if (sy.includes('3') || sy.includes('third')) norm['study_year'] = 'Third Year';
    else if (sy.includes('4') || sy.includes('fourth') || sy.includes('final') || sy.includes('post')) norm['study_year'] = 'Fourth Year';
    else norm['study_year'] = 'Third Year';

    // 2. Socio-economic background
    const se = String(raw['socio-economic_background'] || raw['socio_economic_background'] || '').toLowerCase();
    if (se.includes('low') && se.includes('mid')) norm['socio-economic_background'] = 'Lower-middle';
    else if (se.includes('up') && se.includes('mid')) norm['socio-economic_background'] = 'Upper-middle';
    else if (se.includes('low')) norm['socio-economic_background'] = 'Low';
    else if (se.includes('high')) norm['socio-economic_background'] = 'High';
    else norm['socio-economic_background'] = 'Middle';

    // 3. Assignment Submission Timing
    const ast = String(raw.assignment_submission_timing || '').toLowerCase();
    if (ast.includes('well before') || ast.includes('advance') || ast.includes('always')) norm['assignment_submission_timing'] = 'Always';
    else if (ast.includes('deadline day') || ast.includes('often')) norm['assignment_submission_timing'] = 'Often';
    else if (ast.includes('few hours') || ast.includes('sometimes')) norm['assignment_submission_timing'] = 'Sometimes';
    else if (ast.includes('occasion')) norm['assignment_submission_timing'] = 'Occasionally';
    else if (ast.includes('after') || ast.includes('late') || ast.includes('never')) norm['assignment_submission_timing'] = 'Never';
    else norm['assignment_submission_timing'] = 'Sometimes';

    // 4. Last-minute Exam Preparation
    const lm = String(raw.last_minute_exam_preparation || '').toLowerCase();
    if (lm.includes('yes') || lm.includes('always') || lm.includes('often')) norm['last_minute_exam_preparation'] = 'Yes';
    else norm['last_minute_exam_preparation'] = 'No';

    // 5. Stress Due to Procrastination
    const st = String(raw.stress_due_to_procrastination || '').toLowerCase();
    if (st.includes('signif') || st.includes('always')) norm['stress_due_to_procrastination'] = 'Significantly';
    else if (st.includes('mod') || st.includes('often')) norm['stress_due_to_procrastination'] = 'Moderately';
    else if (st.includes('slight') || st.includes('some')) norm['stress_due_to_procrastination'] = 'Slightly';
    else norm['stress_due_to_procrastination'] = 'Not at all';

    // 6. Study Hours Per Week
    const sh = raw.study_hours_per_week !== undefined ? raw.study_hours_per_week : raw.weekly_study_hours;
    if (typeof sh === 'number') {
      if (sh <= 5) norm['study_hours_per_week'] = '0-5 hours';
      else if (sh <= 10) norm['study_hours_per_week'] = '6-10 hours';
      else if (sh <= 15) norm['study_hours_per_week'] = '11-15 hours';
      else norm['study_hours_per_week'] = '16+ hours';
    } else {
      const shStr = String(sh || '').toLowerCase();
      if (shStr.includes('0-5') || shStr.includes('<5')) norm['study_hours_per_week'] = '0-5 hours';
      else if (shStr.includes('6-10')) norm['study_hours_per_week'] = '6-10 hours';
      else if (shStr.includes('11-15')) norm['study_hours_per_week'] = '11-15 hours';
      else if (shStr.includes('16')) norm['study_hours_per_week'] = '16+ hours';
      else norm['study_hours_per_week'] = '6-10 hours';
    }

    // 7. CGPA
    const gpa = raw.cgpa;
    if (typeof gpa === 'number') {
      const scaled = gpa > 4.0 ? (gpa / 10.0) * 4.0 : gpa;
      if (scaled < 2.50) norm['cgpa'] = 'Below 2.50';
      else if (scaled < 3.00) norm['cgpa'] = '2.50 - 2.99';
      else if (scaled < 3.50) norm['cgpa'] = '3.00 - 3.49';
      else if (scaled < 3.75) norm['cgpa'] = '3.50 - 3.74';
      else norm['cgpa'] = '3.75 - 4.00';
    } else {
      const gpaStr = String(gpa || '');
      if (gpaStr.includes('Below') || gpaStr.includes('<2.5')) norm['cgpa'] = 'Below 2.50';
      else if (gpaStr.includes('2.50')) norm['cgpa'] = '2.50 - 2.99';
      else if (gpaStr.includes('3.00')) norm['cgpa'] = '3.00 - 3.49';
      else if (gpaStr.includes('3.50')) norm['cgpa'] = '3.50 - 3.74';
      else if (gpaStr.includes('3.75')) norm['cgpa'] = '3.75 - 4.00';
      else norm['cgpa'] = '3.00 - 3.49';
    }

    // 8. Use of Time Management
    const tm = String(raw.use_of_time_management || raw.time_management_usage || '').toLowerCase();
    if (tm.includes('alw')) norm['use_of_time_management'] = 'Always';
    else if (tm.includes('oft')) norm['use_of_time_management'] = 'Often';
    else if (tm.includes('som')) norm['use_of_time_management'] = 'Sometimes';
    else if (tm.includes('occ')) norm['use_of_time_management'] = 'Occasionally';
    else if (tm.includes('nev') || tm.includes('rar')) norm['use_of_time_management'] = 'Never';
    else norm['use_of_time_management'] = 'Sometimes';

    // 9. Training
    const tr = String(raw.procrastination_management_training || '').toLowerCase();
    norm['procrastination_management_training'] = tr.includes('yes') ? 'Yes' : 'No';

    // 10. Recovery Strategies
    const rs = String(raw.procrastination_recovery_strategies || raw.recovery_strategies || '').toLowerCase();
    norm['procrastination_recovery_strategies'] = rs.includes('yes') ? 'Yes' : 'No';

    // 11. Mobile screen time
    const mb = String(raw.hours_spent_on_mobile_non_academic || raw.mobile_non_academic_usage || '').toLowerCase();
    if (mb.includes('1-2') || mb.includes('<1')) norm['hours_spent_on_mobile_non_academic'] = '1-2 hours';
    else if (mb.includes('3-4') || mb.includes('2-3')) norm['hours_spent_on_mobile_non_academic'] = '3-4 hours';
    else norm['hours_spent_on_mobile_non_academic'] = 'More than 4 hours';

    // 12. Study Session Distractions
    const sd = String(raw.study_session_distractions || '').toLowerCase();
    if (sd.includes('alw') || sd.includes('ext')) norm['study_session_distractions'] = 'Always';
    else if (sd.includes('oft') || sd.includes('hig')) norm['study_session_distractions'] = 'Often';
    else if (sd.includes('som') || sd.includes('mod')) norm['study_session_distractions'] = 'Sometimes';
    else if (sd.includes('occ')) norm['study_session_distractions'] = 'Occasionally';
    else if (sd.includes('nev') || sd.includes('low')) norm['study_session_distractions'] = 'Never';
    else norm['study_session_distractions'] = 'Sometimes';

    return norm;
  }

  processStudentInput(input) {
    if (!this.encoder) {
      this.init();
    }

    const normInput = this.normalizeStudentInput(input);
    const featureRow = {};
    for (const catCol of CATEGORICAL_COLUMNS) {
      featureRow[catCol] = normInput[catCol];
    }

    // Process procrastination reasons
    let reasonFeatures = {};
    if (typeof input.procrastination_reasons === 'string') {
      reasonFeatures = parseReasonsText(input.procrastination_reasons);
    } else if (Array.isArray(input.procrastination_reasons)) {
      reasonFeatures = parseReasonsText(input.procrastination_reasons.join(', '));
    } else {
      for (const binCol of BINARY_REASON_COLUMNS) {
        reasonFeatures[binCol] = input[binCol] === 1 || input[binCol] === true || input[binCol] === '1' ? 1 : 0;
      }
    }

    for (const binCol of BINARY_REASON_COLUMNS) {
      featureRow[binCol] = reasonFeatures[binCol] || 0;
    }

    const vector = this.encoder.transform(featureRow);
    return {
      featureRow,
      vector,
      featureNames: this.encoder.featureNames
    };
  }
}

module.exports = new PreprocessingService();
