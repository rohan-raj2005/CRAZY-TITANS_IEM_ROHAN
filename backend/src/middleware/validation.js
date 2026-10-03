function validateStudentInput(req, res, next) {
  const data = req.body;

  if (!data || typeof data !== 'object') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid request body. JSON object expected.',
        type: 'ValidationError'
      }
    });
  }

  // Ensure minimum default values for core fields if missing
  if (!data.study_year) data.study_year = '3rd year';
  if (!data.socio_economic_background && !data['socio-economic_background']) data.socio_economic_background = 'Middle';
  if (data.cgpa === undefined && data.cgpa_range === undefined) data.cgpa = 7.5;
  if (data.study_hours_per_week === undefined && data.weekly_study_hours === undefined) data.study_hours_per_week = '6-10 hours';
  if (!data.assignment_submission_timing) data.assignment_submission_timing = 'On the deadline day';

  next();
}

module.exports = {
  validateStudentInput
};
