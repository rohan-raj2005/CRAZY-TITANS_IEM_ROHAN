// In-memory student history repository with optional MongoDB fallback
class StudentRepository {
  constructor() {
    this.students = [];
    this.idCounter = 1;
  }

  save(studentData) {
    const id = `stu_${Date.now()}_${this.idCounter++}`;
    const timestamp = new Date().toISOString();
    const student = {
      id,
      _id: id,
      recordId: id,
      createdAt: timestamp,
      timestamp,
      studentInput: studentData.studentData || studentData.studentInput || {},
      prediction: {
        probability: studentData.probability,
        riskTier: studentData.riskTier || studentData.riskLevel,
        riskLevel: studentData.riskLevel || studentData.riskTier,
        label: studentData.label
      },
      ...studentData
    };
    this.students.unshift(student); // newest first
    return student;
  }

  findAll(limit = 50) {
    return this.students.slice(0, limit);
  }

  findById(id) {
    return this.students.find(s => s._id === id || s.id === id) || null;
  }

  count() {
    return this.students.length;
  }
}

const studentRepo = new StudentRepository();

module.exports = studentRepo;
