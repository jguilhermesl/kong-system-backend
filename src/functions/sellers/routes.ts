import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchSellers } from './fetch-sellers';

const routerSellers = Router();

routerSellers.get('/sellers', authMiddleware, isAdminMiddleware, (req, res) => fetchSellers(req, res));

export { routerSellers }