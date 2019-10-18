import HelpOrder from '../models/HelpOrder';
import User from '../models/User';
import Student from '../models/Student';
import Mail from '../../libs/Mail';

class HelpOrderController {
  async index(req, res) {
    const helps = await HelpOrder.findAll({
      attributes: [
        'id',
        'question',
        'answer',
        'answered_at',
        'created_at',
        'updated_at',
      ],
      where: { answered_at: null, canceled_at: null },
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

  async store(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const help = await HelpOrder.findOne({
      where: { id, answered_at: null },
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
    if (!help) {
      return res.status(400).json({ error: 'Register not found ' });
    }
    help.answered_at = new Date();
    help.answer = answer;
    help.user_id = req.userId;
    await help.save();

    // Send email to student with the answer
    const { student, user } = help;
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'You have an answer from Gym Point!',
      template: 'helpOrderAnswered',
      context: {
        name: student.name,
        question: help.question,
        answer: help.answer,
        user: user.name,
        image: `${process.env.APP_URL}/files/logo.png`,
      },
      // attachments: [
      //   {
      //     filename: 'logo.png',
      //     path: resolve(__dirname, '..', 'views', 'images'),
      //     cid: 'logo',
      //   },
      // ],
    });

    return res.status(200).json(help);
  }

  async delete(req, res) {
    const { id } = req.params;

    const help = await HelpOrder.findByPk(id);
    help.canceled_at = new Date();

    await help.save();

    return res.status(200).json({ ok: true });
  }
}

export default new HelpOrderController();
