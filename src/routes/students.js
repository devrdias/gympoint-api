import { Router } from 'express';
import CheckinController from '../app/controllers/CheckinController';
import StudentController from '../app/controllers/StudentController';
import StudentHelpOrderController from '../app/controllers/StudentHelpOrderController';

const router = new Router();

router.post('/', StudentController.store);
router.put('/', StudentController.update);

router.get('/:id/checkins', CheckinController.index);
router.put('/:id/checkins', CheckinController.update);

router.get('/:student_id/help-orders', StudentHelpOrderController.index);
router.post('/:student_id/help-orders', StudentHelpOrderController.store);
router.get('/:id/help-orders', StudentHelpOrderController.index);

export default router;
