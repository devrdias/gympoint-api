import { Router } from 'express';
import StudentController from '../app/controllers/StudentController';

const router = new Router();

// ====================
// authenticated routes
// ====================
router.post('/', StudentController.store);
router.put('/', StudentController.update);

export default router;
