import { Router } from 'express';
import EnrollmentController from '../app/controllers/EnrollmentController';

const router = new Router();

router.get('/', EnrollmentController.index);
router.post('/', EnrollmentController.store);
router.put('/:id', EnrollmentController.update);
router.delete('/:id', EnrollmentController.delete);

export default router;
