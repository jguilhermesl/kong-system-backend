import { Router } from 'express';
import { fetchUserIndications } from './fetch-user-indications';

const routerIndications = Router();

routerIndications.get('/indications', fetchUserIndications);

export { routerIndications };
