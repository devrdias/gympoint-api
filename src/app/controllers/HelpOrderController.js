import HelpOrder from '../models/HelpOrder';
import User from '../models/User';
import Student from '../models/Student';

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

    const help = await HelpOrder.findOne({ where: { id, answered_at: null } });
    if (!help) {
      return res.status(400).json({ error: 'Register not found ' });
    }
    help.answered_at = new Date();
    help.answer = answer;
    help.user_id = req.userId;
    await help.save();

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
