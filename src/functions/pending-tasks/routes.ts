import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { fetchPendingTasks } from './fetch-pending-tasks';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';

const routerPendingTasks = Router();

routerPendingTasks.get('/pending-tasks', authMiddleware, isAdminMiddleware, fetchPendingTasks);

export { routerPendingTasks }
