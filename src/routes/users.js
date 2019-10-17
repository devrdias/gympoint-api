import { Router } from 'express';
import UserController from '../app/controllers/UserController';
import authMiddleware from '../app/middlewares/auth';

const router = new Router();

router.post('/', UserController.store);

// ====================
// authenticated routes
// ====================
router.use(authMiddleware);
router.put('/', UserController.update);

export default router;
