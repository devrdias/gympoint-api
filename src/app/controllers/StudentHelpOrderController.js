import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import User from '../models/User';
import Student from '../models/Student';

class StudentHelpOrderController {
  /**
   * List helps for students
   */
  async index(req, res) {
    const { student_id } = req.params;

    const helps = await HelpOrder.findAll({
      attributes: [
        'id',
        'question',
        'answer',
        'answered_at',
        'created_at',
        'updated_at',
      ],
      where: { student_id, canceled_at: null },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email', 'admin'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'birth'],
        },
      ],
    });

    return res.status(200).json(helps);
  }

  /**
   * Student create a question/help
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string()
        .max(500)
        .required(),
    });
    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // validate student
    const { student_id } = req.params;
    const studentExists = await Student.findOne({
      where: { canceled_at: null },
    });
    if (!studentExists) {
      return res.status(400).json({ error: 'Invalid Student' });
    }

    const { question } = req.body;
    const help = await HelpOrder.create({ student_id, question });
    return res.status(200).json(help);
  }
}

export default new StudentHelpOrderController();
