import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchClients } from './fetch-clients';
import { fetchClientPurchases } from './fetch-client-purchases';

const routerClient = Router();

routerClient.get('/client', authMiddleware, isAdminMiddleware, (req, res) => fetchClients(req, res));
routerClient.get('/client/:id/purchases', authMiddleware, (req, res) => fetchClientPurchases(req, res));

export { routerClient }