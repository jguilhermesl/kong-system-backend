import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchClients } from './fetch-clients';

const routerClient = Router();

routerClient.get('/client', authMiddleware, isAdminMiddleware, (req, res) => fetchClients(req, res));

export { routerClient }