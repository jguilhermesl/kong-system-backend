import { authMiddleware } from '@/middlewares/auth-middleware';
import { Router } from 'express';
import { fetchStatement } from './fetch-statement';

const routerStatement = Router();

routerStatement.get('/statement/:id', authMiddleware, fetchStatement);

export { routerStatement };
