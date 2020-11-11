import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import bcrypt from 'bcryptjs';
import Ongs from '../models/Ong';
import FileOng from '../models/Image';
import checkPassword from '../utils/checkPassword';
import imagesView from '../views/image_views';

export default {
  async index(request: Request, response: Response) {
    const ongsRepository = getRepository(Ongs);

    const pets = await ongsRepository.find({
      relations: ['image', 'pets'],
    });

    return response.json(pets);
  },
  async show(request: Request, response: Response) {
    const ongsRepository = getRepository(Ongs);
    const { id } = request.user;

    const pets = await ongsRepository.findOne(id, {
      relations: ['image', 'pets'],
    });

    return response.json(pets);
  },
  async create(request: Request, response: Response) {
    const { name, email, password, description, city, uf } = request.body;

    const userRepository = getRepository(Ongs);

    const data = {
      name,
      email,
      password,
      description,
      city,
      uf,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required(),
      description: Yup.string().required(),
      city: Yup.string().required(),
      uf: Yup.string().required(),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const userExists = await userRepository.findOne({ where: { email } });

    if (userExists) {
      return response.status(400).json({ erro: 'User already exists' });
    }

    const password_hash = await bcrypt.hash(password, 8);
    const ong = userRepository.create({
      name,
      email,
      password: password_hash,
      description,
      city,
      uf,
    });
    console.log(ong);

    await userRepository.save(ong);

    return response.status(201).json(ong);
  },
  async update(request: Request, response: Response) {
    const ongsRepository = getRepository(Ongs);
    const imageRepository = getRepository(FileOng);

    const {
      name,
      email,
      password,
      confirmPassword,
      oldPassword,
      description,
      city,
      uf,
    } = request.body;

    const { id } = request.user;

    const data = {
      name,
      email,
      password,
      confirmPassword,
      oldPassword,
      description,
      city,
      uf,
      id: Number(id),
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      oldPassword: Yup.string().min(6),
      description: Yup.string().required(),
      city: Yup.string().required(),
      uf: Yup.string().required(),
      password: Yup.string()
        .min(6)
        // eslint-disable-next-line no-shadow
        .when('oldPassword', (oldPassword: string, field: any): void =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when(
        'password',
        // eslint-disable-next-line no-shadow
        (password: string, field: any): void =>
          password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(data))) {
      return response.status(400).json({ error: 'validation failed datas' });
    }

    const ongExists = await ongsRepository.findOne(id);

    if (!ongExists) {
      return response.status(401).json({ error: 'Ong not found' });
    }

    if (email !== ongExists?.email) {
      const emailExists = await ongsRepository.findOne({ where: { email } });

      if (emailExists) {
        return response.status(400).json({ error: 'User already exists' });
      }
    }

    if (!(await checkPassword(oldPassword, ongExists.password))) {
      return response.status(401).json({ error: 'Password does not match' });
    }

    if (request.file) {
      const { filename } = request.file as Express.Multer.File;
      const imageValidation = { path: filename };

      const { path } = imageValidation;
      const ImageExists = await imageRepository.findOne({
        where: { ong: ongExists },
      });
      const dataImage = {
        path,
        ong: ongExists,
      };

      if (ImageExists) {
        await imageRepository.remove(ImageExists);
        const image = await imageRepository.save(dataImage);
        return response.json(imagesView.render(image));
      }

      const newImage = imageRepository.create(dataImage);
      await imageRepository.save(newImage);
      return response.json(imagesView.render(newImage));
    }

    const password_hash = await bcrypt.hash(password, 8);
    ongExists.name = name;
    ongExists.email = email;
    ongExists.password = password_hash;
    ongExists.description = description;
    ongExists.city = city;
    ongExists.uf = uf;

    await ongsRepository.save(ongExists);

    return response.json(ongExists);
  },
};
