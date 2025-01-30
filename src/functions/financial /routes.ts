import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchFinancial } from './fetch-financial';

const routerFinancial = Router();

routerFinancial.get('/financial', authMiddleware, isAdminMiddleware, fetchFinancial);

export { routerFinancial }
