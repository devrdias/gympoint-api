import { subDays } from 'date-fns';
import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class CheckinController {
  /**
   * List checkins
   */
  async index(req, res) {
    const { id: student_id } = req.params;

    const checkins = await Checkin.find({ student_id }).sort({ createdAt: -1 });
    return res.status(200).json(checkins);
  }

  /**
   * List checkins
   */
  async store(req, res) {
    const { id: student_id } = req.params;

    // check if student exists
    const studentExists = await Student.findOne({
      where: { id: req.params.id, canceled_at: null },
    });
    if (!studentExists) {
      return res.status(400).json({ error: 'Student doest not exist' });
    }

    // check if student has checking more than 7 days a week
    const dateLimit = subDays(new Date(), 6);
    const checkinCount = await Checkin.countDocuments({
      student_id,
      createdAt: { $gt: dateLimit },
    })
      .limit(10)
      .sort({ createdAt: -1 });

    if (checkinCount >= 7) {
      return res
        .status(400)
        .json({ error: 'No more checkins allowed this week' });
    }

    const checkin = await Checkin.create({ student_id });
    return res.status(200).json(checkin);
  }
}

export default new CheckinController();
