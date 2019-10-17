import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  /**
   * Create User
   */
  async store(req, res) {
    // Validate User Schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      admin: Yup.boolean().default(false),
      password: Yup.string()
        .required()
        .min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Check if user/email already exists
    const { email } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, birth, weight, height } = await User.create(req.body);
    return res.status(200).json({ id, name, email, birth, weight, height });
  }

  /**
   * Update User
   */
  async update(req, res) {
    // Validate User Schema
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      admin: Yup.boolean(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword } = req.body;
    // check if email is already registered by other user
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email not available' });
      }
    }
    // check if old password match current password to allows updating
    if (oldPassword && !user.checkPassword(oldPassword)) {
      return res.status(401).json({ error: 'Password does not match ' });
    }

    const { id, name, weight, height, birth } = await user.update(req.body);

    return res.status(200).json({ id, name, email, birth, weight, height });
  }
}

export default new UserController();
