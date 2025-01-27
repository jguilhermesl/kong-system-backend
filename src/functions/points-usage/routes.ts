import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { requestGame } from './request-game';
import { updatePointsUsageStatus } from './update-points-usage-status';
import { fetchPointsUsage } from './fetch-points-usage';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';

const routerPointsUsage = Router();

routerPointsUsage.post('/request-game', authMiddleware, requestGame);
routerPointsUsage.get('/points-usage', authMiddleware, isAdminMiddleware, fetchPointsUsage);
routerPointsUsage.post('/points-usage/:id/action', authMiddleware, isAdminMiddleware, updatePointsUsageStatus);

export { routerPointsUsage }
