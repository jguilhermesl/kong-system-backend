import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth-middleware';
import { isAdminMiddleware } from '@/middlewares/admin-middleware';
import { fetchInventory } from './fetch-inventory';
import { getInventoryDetail } from './get-inventory-detail';
import { addInventorySale } from './add-inventory-sale';

const routerInventory = Router();

routerInventory.get('/inventory', authMiddleware, isAdminMiddleware, (req, res) => fetchInventory(req, res));
routerInventory.get('/inventory/:id', authMiddleware, isAdminMiddleware, (req, res) => getInventoryDetail(req, res));
routerInventory.patch('/inventory/:id', authMiddleware, isAdminMiddleware, (req, res) => addInventorySale(req, res));

export { routerInventory }