import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Request, Response, NextFunction } from 'express';

import authConfig from '../config/auth';

interface ITokeyPayload {
  iat: number;
  exp: number;
  id: string;
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not providen' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    const { id } = decoded as ITokeyPayload;
    req.user = {
      id,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
