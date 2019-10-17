import { Router } from 'express';
import PlanController from '../app/controllers/PlanController';
import adminMiddleware from '../app/middlewares/admin';

const router = new Router();

router.get('/', PlanController.index);

// =================
// only Admin routes
// =================
router.use(adminMiddleware);
router.post('/', PlanController.store);
router.put('/:id', PlanController.update);
router.delete('/:id', PlanController.delete);

export default router;
