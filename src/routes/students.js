import { Router } from 'express';
import CheckinController from '../app/controllers/CheckinController';
import StudentController from '../app/controllers/StudentController';
import StudentHelpOrderController from '../app/controllers/StudentHelpOrderController';

const router = new Router();

router.get('/', StudentController.index);
router.post('/', StudentController.store);
router.put('/', StudentController.update);

router.get('/:id/checkins', CheckinController.index);
router.post('/:id/checkins', CheckinController.store);

router.get('/:student_id/help-orders', StudentHelpOrderController.index);
router.post('/:student_id/help-orders', StudentHelpOrderController.store);
router.get('/:id/help-orders', StudentHelpOrderController.index);

export default router;
