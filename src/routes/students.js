import { Router } from 'express';
import StudentController from '../app/controllers/StudentController';
import authMiddleware from '../app/middlewares/auth';

const router = new Router();

// ====================
// authenticated routes
// ====================
router.use(authMiddleware);
router.post('/', StudentController.store);
router.put('/', StudentController.update);

export default router;