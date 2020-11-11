import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import * as Yup from 'yup';

import Ongs from '../models/Ong';
import checkPassword from '../utils/checkPassword';

import authConfig from '../config/auth';

export default {
  async store(req: Request, res: Response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation fails' });
    }

    const userRepository = getRepository(Ongs);

    const { email, password } = req.body;

    const userExists = await userRepository.findOne({
      where: { email },
      relations: ['image'],
    });

    if (!userExists) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await checkPassword(password, userExists.password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, image } = userExists;
    console.log(userExists);

    return res.json({
      user: {
        id,
        name,
        email,
        image,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  },
};
