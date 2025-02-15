import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchDashboard } from './fetchDashboard';

const routerDashboard = Router();

routerDashboard.get('/dashboard', authMiddleware, isAdminMiddleware, fetchDashboard);

export { routerDashboard };
