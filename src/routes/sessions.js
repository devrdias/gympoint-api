import { Router } from 'express';
import SessionController from '../app/controllers/SessionController';

const router = new Router();

router.post('/', SessionController.store);

export default router;
