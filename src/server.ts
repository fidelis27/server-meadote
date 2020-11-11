import 'dotenv/config';
import express, { json } from 'express';
import cors from 'cors';
import path from 'path';
import 'express-async-errors';

import './database/connection';

import routes from './routes';

const app = express();

app.use(json());
app.use(cors());
app.use(routes);
app.use('/image', express.static(path.resolve(__dirname, '..', 'image')));

const port = 3333;
app.listen(port, () => console.log(`server is running on port ${port}`));
