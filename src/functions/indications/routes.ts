import { authMiddleware } from '@/middlewares/auth-middleware';
import { Router } from 'express';
import { fetchIndications } from './fetch-indications';
import { deleteIndication } from './delete-indication';

const routerIndications = Router();

routerIndications.get('/indications', authMiddleware, fetchIndications);
routerIndications.delete('/indications/:id', authMiddleware, deleteIndication);

export { routerIndications };
