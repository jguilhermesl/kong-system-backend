import { Router } from 'express';
import { authenticate } from './authenticate';
import { refreshToken } from './refresh-token';
import { meProfile } from './me-profile';
import { authMiddleware } from '@/middlewares/auth-middleware';

const routerAuth = Router();

routerAuth.post('/auth', (req, res) => authenticate(req, res));
routerAuth.post('/refresh-token', (req, res) => refreshToken(req, res));
routerAuth.get('/me', authMiddleware, (req, res) => meProfile(req, res));

export { routerAuth }