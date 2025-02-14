import { Router } from 'express';
import { authenticate } from './authenticate';
import { refreshToken } from './refresh-token';
import { meProfile } from './me-profile';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { forgotPassword } from './forgot-password';
import { recoverPassword } from './recover-password';

const routerAuth = Router();

routerAuth.post('/auth', (req, res) => authenticate(req, res));
routerAuth.post('/refresh-token', (req, res) => refreshToken(req, res));
routerAuth.get('/me', authMiddleware, (req, res) => meProfile(req, res));
routerAuth.post('/forgot-password', (req, res) => forgotPassword(req, res));
routerAuth.post('/recover-password', (req, res) => recoverPassword(req, res));

export { routerAuth }