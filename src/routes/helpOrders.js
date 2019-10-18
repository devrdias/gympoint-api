import { Router } from 'express';
import HelpOrderController from '../app/controllers/HelpOrderController';

const router = new Router();

router.get('/', HelpOrderController.index);
router.post('/:id/answer', HelpOrderController.store);
router.delete('/', HelpOrderController.delete);

export default router;
