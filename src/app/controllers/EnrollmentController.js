import { parseISO, addMonths, format } from 'date-fns';
import * as Yup from 'yup';
import enUS from 'date-fns/locale/en-US';
import { resolve } from 'path';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Mail from '../../libs/Mail';

class EnrollmentController {
  /**
   *  List all active students - with pagination
   */
  async index(req, res) {
    const { page = 1 } = req.query;

    const enrollments = await Enrollments.findAll({
      where: { canceled_at: null },
      attributes: ['student_id', 'plan_id', 'start_date', 'end_date', 'price'],
      order: ['start_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: Plan,
          as: 'plan',
        },
      ],
    });

    return res.status(200).json(enrollments);
  }

  /**
   *  Store a new Enrollment
   */
  async store(req, res) {
    // validate Enrollment Schema
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
      end_date: Yup.date().required(),
      price: Yup.number()
        .moreThan(0)
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    // Verify if student exists
    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }
    if (student.canceled_at) {
      return res.status(400).json({
        error:
          'Student not active. Please reactivate student before enrollment',
      });
    }

    // verify if student already enrolled
    const enrollmentExists = await Enrollment.findOne({
      where: { student_id, canceled_at: null },
    });
    if (enrollmentExists) {
      return res.status(400).json({ error: 'Student already enrolled' });
    }

    // verify if chosen plan is valid
    const plan = await Plan.findOne({
      where: { id: plan_id, canceled_at: null },
    });
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    // Calculate end_date and price
    const { duration, price, title } = plan;
    const calcEndDate = addMonths(parseISO(start_date), duration);
    const calcPrice = Math.round(duration * price);

    // const isoStartDate = parseISO(req.body.start_date);
    // const isoEndDate = parseISO(req.body.end_date);
    // const enrollment = await Enrollment.create({
    //   ...req.body,
    //   end_date: calcEndDate,
    //   price: calcPrice,
    // });

    /**
     * Send welcome message email
     */
    const { name, email } = student;
    console.log(resolve(__dirname, '..', 'views', 'images'));
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Welcome to Gym Point!',
      template: 'enrollmentConfirmation',
      context: {
        name,
        title,
        duration,
        start_date: format(parseISO(req.body.start_date), 'yyyy-MM-dd', {
          locale: enUS,
        }),
        end_date: format(parseISO(req.body.end_date), 'yyyy-MM-dd', {
          locale: enUS,
        }),
        price,
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

    return res.status(200).json({ okd: true });
  }

  /**
   * Update enrollment
   */
  async update(req, res) {
    const { plan_id, start_date } = req.body;
    const { id } = req.params;

    // check if enrollment exists
    const enrollment = await Enrollment.findOne({
      where: { id, canceled_at: null },
    });
    if (!enrollment) {
      return res.status(400).json({ error: 'Register not found' });
    }

    // verify if chosen plan is valid
    const plan = await Plan.findOne({
      where: { id: plan_id, canceled_at: null },
    });
    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    // Calculate end_date and price
    const { duration, price } = plan;
    const calcEndDate = addMonths(parseISO(start_date), duration);
    const calcPrice = Math.round(duration * price);

    const enroll = await enrollment.update({
      plan_id,
      start_date,
      end_date: calcEndDate,
      price: calcPrice,
    });
    return res.status(200).json(enroll);
  }

  /**
   * Delete enrollment
   */
  async delete(req, res) {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id);

    enrollment.canceled_at = new Date();
    await enrollment.save();

    return res.status(200).json(enrollment);
  }
}

export default new EnrollmentController();
