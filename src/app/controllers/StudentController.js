import Student from '../models/Student';

class StudentController {
  /**
   * Create Student
   */
  async store(req, res) {
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const { id, name, email, birth, weight, height } = await Student.create(
      req.body
    );
    return res.status(200).json({ id, name, email, birth, weight, height });
  }

  /**
   * Update Student
   */
  async update(req, res) {
    return res.json({ ok: true });
  }
}

export default new StudentController();
