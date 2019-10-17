import * as Yup from 'yup';
import { Op } from 'sequelize';
import Plan from '../models/Plan';

class PlanController {
  /**
   * List Plans
   */
  async index(req, res) {
    const plans = await Plan.findAll({
      where: { canceled_at: null },
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['duration'],
    });
    return res.status(200).json(plans);
  }

  /**
   * Create a Plan
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number()
        .required()
        .moreThan(0),
      duration: Yup.number()
        .required()
        .min(1)
        .max(36),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Check for duplicated plan
    const { duration } = req.body;
    const checkPlan = await Plan.findOne({ where: { duration } });
    if (checkPlan) {
      return res.status(400).json({ error: 'Duplicated Plan .' });
    }

    const { id, title, price } = await Plan.create(req.body);
    return res.status(200).json({ id, title, price, duration });
  }

  /**
   * Update a Plan
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      price: Yup.number().moreThan(0),
      duration: Yup.number()
        .min(1)
        .max(36),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { duration } = req.body;
    const plan = await Plan.findByPk(req.params.id);

    // Check for duplication
    if (plan.duration !== duration) {
      const planExists = await Plan.findOne({
        where: {
          [Op.and]: [
            { duration },
            { id: { [Op.ne]: req.params.id } },
            { canceled_at: null },
          ],
        },
      });
      if (planExists) {
        return res.status(400).json({ error: 'Plan Duration already in use' });
      }
    }

    const { id, title, price } = await plan.update(req.body);
    return res.status(200).json({ id, title, price, duration });
  }

  /**
   * Delete a Plan
   */
  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    plan.canceled_at = new Date();
    await plan.save();
    return res.status(200).json(plan);
  }
}

export default new PlanController();
