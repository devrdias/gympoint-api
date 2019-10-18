import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  /**
   * Create Student
   */
  async store(req, res) {
    // validate Student Schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
      birth: Yup.date().required(),
      weight: Yup.string(),
      height: Yup.string(),
      canceled_at: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // check if student/email already exists
    const studentExists = await Student.findOne({
      where: { email: req.body.email, canceled_at: null },
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
    // validate Student Schema
    const schema = Yup.object().schema({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      birth: Yup.date(),
      weight: Yup.string(),
      height: Yup.string(),
      canceled_at: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;
    // check if email is already registered by other user
    const user = await Student.findByPk(req.userId);
    if (email !== user.email) {
      const studentExists = await Student.findOne({
        where: { email, canceled_at: null },
      });
      if (studentExists) {
        return res.status(400).json({ error: 'Email not available' });
      }
    }
    // check if old password match
    if (oldPassword && !user.checkPassword(oldPassword)) {
      return res.status(401).json({ error: 'Password does not match ' });
    }

    const { id, name, weight, height, birth } = await user.update(req.body);

    return res.status(200).json({ id, name, email, birth, weight, height });
  }
}

export default new StudentController();
