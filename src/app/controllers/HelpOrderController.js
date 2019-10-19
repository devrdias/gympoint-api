import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import User from '../models/User';
import HelpAnsweredMail from '../jobs/HelpAnsweredMail';
import Queue from '../../libs/Queue';

class HelpController {
  /**
   * List Help Orders not answered
   */
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

  /**
   * Answer a Help Order
   */
  async store(req, res) {
    // validate HelpOrder schema
    const schema = Yup.object().shape({
      answer: Yup.string()
        .max(500)
        .required(),
    });
    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // check if help order exists
    const { id } = req.params;
    const { answer } = req.body;
    const help = await HelpOrder.findOne({
      where: { id, answered_at: null },
      include: [
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

    // get user data to use on email
    const user = await User.findByPk(req.userId);

    // Send email to student with the answer
    Queue.add(HelpAnsweredMail.key, { help, user });

    return res.status(200).json(help);
  }

  /**
   * Delete a Help Order
   */
  async delete(req, res) {
    const { id } = req.params;

    // check if help order exists
    const help = await HelpOrder.findByPk(id);
    if (!help) {
      return res.status(400).json({ error: 'Item not found to delete' });
    }
    help.canceled_at = new Date();

    await help.save();

    return res.status(200).json({ ok: true });
  }
}

export default new HelpController();
