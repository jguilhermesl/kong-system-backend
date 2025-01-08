import { Router } from 'express';
import { fetchUsers } from './fetch-users';
import { createUser } from './create-user';
import { updateUser } from './update-user';
import { deleteUser } from './delete-user';

const routerUser = Router();

routerUser.get('/user', (req, res) => fetchUsers(req, res));
routerUser.post('/user', (req, res) => createUser(req, res));
routerUser.put('/user/:id', (req, res) => updateUser(req, res));
routerUser.delete('/user/:id', (req, res) => deleteUser(req, res));

export { routerUser }