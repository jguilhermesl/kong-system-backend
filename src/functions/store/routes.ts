import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { fetchStore } from './fetch-store';

const routerStore = Router();

routerStore.get('/store', authMiddleware, (req, res) => fetchStore(req, res));

export { routerStore }