import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    // add user_id to every authenticated request
    req.userId = decoded.id;
    req.isAdmin = decoded.admin;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
