import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';
import petView from '../views/pet_view';

import Pets from '../models/Pet';

export default {
  async index(request: Request, response: Response) {
    const petsRepository = getRepository(Pets);

    const pets = await petsRepository.find({
      relations: ['ong', 'images'],
      where: { ong_id: request.user.id },
    });

    return response.json(petView.renderMany(pets));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const petsRepository = getRepository(Pets);

    const pet = await petsRepository.findOne(id, {
      relations: ['images', 'ong'],
    });
    if (!pet) {
      return response.status(401).json({ error: 'Pet not found' });
    }

    return response.json(petView.render(pet));
  },

  async create(request: Request, response: Response) {
    const { name, description, adopted, breed } = request.body;

    const petsRepository = getRepository(Pets);

    const requestImages = request.files as Express.Multer.File[];

    const images =
      requestImages && requestImages.map(image => ({ path: image.filename }));

    const { id } = request.user;
    const adoptedValue = adopted === 'true';

    const data = {
      name,
      description,
      ong_id: id,
      adopted: adoptedValue,
      images,
      breed,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      adopted: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        })
      ),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const pet = petsRepository.create(data);

    await petsRepository.save(pet);

    return response.status(201).json(pet);
  },
  async updateAdopted(request: Request, response: Response) {
    const { adopted, id } = request.body;

    const petsRepository = getRepository(Pets);

    const adoptedValue = adopted === true;

    const data = {
      id,
      adopted: adoptedValue,
    };

    const pet = await petsRepository.save(data);

    return response.status(201).json(pet);
  },

  async delete(request: Request, response: Response) {
    const petsRepository = getRepository(Pets);
    const { id } = request.params;
    const idOng = request.user.id;

    const pet = await petsRepository.findOne(id, {
      relations: ['ong'],
    });
    if (!pet) {
      return response.status(401).json({ error: 'not found' });
    }

    if (!(idOng === pet.ong_id)) {
      return response.status(401).json({ error: 'not authorized' });
    }

    await petsRepository.delete(pet);
    return response.json(pet);
  },
};
