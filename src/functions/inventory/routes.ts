import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchInventory } from './fetch-inventory';
import { getInventoryDetail } from './get-inventory-detail';
import { addInventorySale } from './add-inventory-sale';
import { addInventory } from './add-inventory';

const routerInventory = Router();

routerInventory.get('/inventory', authMiddleware, isAdminMiddleware, (req, res) => fetchInventory(req, res));
routerInventory.post('/inventory', authMiddleware, isAdminMiddleware, (req, res) => addInventory(req, res));
routerInventory.get('/inventory/:id', authMiddleware, isAdminMiddleware, (req, res) => getInventoryDetail(req, res));
routerInventory.patch('/inventory/:id', authMiddleware, isAdminMiddleware, (req, res) => addInventorySale(req, res));

export { routerInventory }