import express from 'express';

import multer from 'multer';

import multerConfig from './config/multer';

import PetsController from './controllers/PetsController';
import PetToadoption from './controllers/PetToadoption';
import PetsAdopted from './controllers/PetsAdopted';
import OngController from './controllers/OngController';
import SessionController from './controllers/SessionController';
import authMiddleware from './middlewares/auth';

const upload = multer(multerConfig);

const routes = express.Router();
routes.use(express.static(`${__dirname}/temp`));

routes.get('/pets', authMiddleware, PetsController.index);
routes.get('/pets/:id', PetsController.show);
routes.post(
  '/pets',
  authMiddleware,
  upload.array('images'),
  PetsController.create
);
routes.delete('/pets/:id', authMiddleware, PetsController.delete);

routes.patch('/adopted/', PetsController.updateAdopted);

routes.get('/all-ongs', OngController.index);
routes.get('/ongs/', authMiddleware, OngController.show);
routes.post('/ongs', OngController.create);
routes.put(
  '/ongs/',
  authMiddleware,
  upload.single('image'),
  OngController.update
);

routes.post('/session', SessionController.store);

routes.get('/pet-to-adoption/', PetToadoption.index);
routes.get('/pet-adopted/', PetsAdopted.index);

export default routes;
