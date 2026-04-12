import express from 'express';
import { Analyzetask, getAlldata, Removedata, Updatedata } from '../Controller/AI_control.js';

const Router = express.Router();

Router.get('/all', getAlldata);

Router.post('/analyze', Analyzetask);

Router.put('/:id', Updatedata);

Router.delete('/:id',  Removedata);

export default Router;