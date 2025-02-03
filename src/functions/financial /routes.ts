import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchFinancial } from './fetch-financial';
import { addFinancial } from './add-financial';
import { deleteFinancial } from './delete-financial';

const routerFinancial = Router();

routerFinancial.get('/financial', authMiddleware, isAdminMiddleware, fetchFinancial);
routerFinancial.post('/financial', authMiddleware, isAdminMiddleware, addFinancial);
routerFinancial.delete('/financial/:id', authMiddleware, isAdminMiddleware, deleteFinancial);

export { routerFinancial }
