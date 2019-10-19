import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  /**
   * Return Authenticated User with API Token
   */
  async store(req, res) {
    // Schema validation
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // validate user and password
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // generate user token
    const { id, name, admin } = user;
    const token = jwt.sign({ id, admin }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    // append token to response
    return res.status(200).json({
      user: {
        id,
        name,
        email,
        admin,
      },
      token,
    });
  }
}

export default new SessionController();
