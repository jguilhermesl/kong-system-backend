import { Router } from 'express';
import { authenticate } from './authenticate';

const routerAuth = Router();

routerAuth.get('/auth', (req, res) => authenticate(req, res));

export { routerAuth }