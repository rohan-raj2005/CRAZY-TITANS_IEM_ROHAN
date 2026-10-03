const predictionService = require('../services/predictionService');
const studentRepo = require('../models/Student');

async function handlePredict(req, res, next) {
  try {
    const studentInput = req.body;
    const modelName = req.query.model || req.body.selectedModel || null;

    const result = await predictionService.predictStudent(studentInput, modelName);

    res.status(200).json({
      success: true,
      data: result,
      prediction: result
    });
  } catch (err) {
    next(err);
  }
}

async function getStudentHistory(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const students = studentRepo.findAll(limit);

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
      students
    });
  } catch (err) {
    next(err);
  }
}

async function getStudentById(req, res, next) {
  try {
    const { id } = req.params;
    const student = studentRepo.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: {
          message: `Student record with id '${id}' not found.`,
          type: 'NotFoundError'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: student,
      student
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handlePredict,
  getStudentHistory,
  getStudentById
};
