import { Router } from 'express';
import StudentController from '../app/controllers/StudentController';

const router = new Router();

/* POST create student */
router.post('/', StudentController.store);

export default router;
