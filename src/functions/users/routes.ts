import { Router } from 'express';
import { fetchUsers } from './fetch-users';
import { createUser } from './create-user';
import { updateUser } from './update-user';
import { deleteUser } from './delete-user';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';

const routerUser = Router();

routerUser.get('/user', authMiddleware, isAdminMiddleware, (req, res) => fetchUsers(req, res));
routerUser.post('/user', (req, res) => createUser(req, res));
routerUser.put('/user/:id', authMiddleware, (req, res) => updateUser(req, res));
routerUser.delete('/user/:id', authMiddleware, isAdminMiddleware, (req, res) => deleteUser(req, res));

export { routerUser }