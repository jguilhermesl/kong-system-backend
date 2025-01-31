import { authMiddleware } from '@/middlewares/auth-middleware';
import { Router } from 'express';
import { fetchGames } from './fetch-games';

const routerGames = Router();

routerGames.get('/games', fetchGames);

export { routerGames };
