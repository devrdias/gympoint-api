import User from '../models/User';

class UserController {
  /**
   * Create User
   */
  async store(req, res) {
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, birth, weight, height } = await User.create(
      req.body
    );
    return res.status(200).json({ id, name, email, birth, weight, height });
  }

  /**
   * Update User
   */
  async update(req, res) {
    const { email, oldPassword } = req.body;

    // check if email is already registered by other user
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
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

export default new UserController();
