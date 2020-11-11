import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import Pets from '../models/Pet';
import petView from '../views/pet_view';

export default {
  async index(request: Request, response: Response) {
    const petsRepository = getRepository(Pets);

    const pets = await petsRepository.find({
      relations: ['images', 'ong'],
      where: { adopted: false },
    });
    if (!pets) {
      return response.status(401).json({ error: 'Pet not found' });
    }

    return response.json(petView.renderMany(pets));
  },
};
